import { CheckCircle, FilterIcon, Search, UserPlus, UserX, XCircle } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import z from "zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { FilterCourseStudentResponse } from "@/services/lab-course/models";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useStudyPrograms } from "@/data/studyProgram";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { AutoComplete } from "@/components/ui/autocomplete";
import PaginationControl from "@/components/pagination/pagination-control";
import PaginationSizeSelect from "@/components/pagination/pagination-size-select";
import {
  filterCourseStudentsQueryOptions,
  useCourseStudents,
  useRemoveStudentFromCourse,
} from "@/data/labCourseStudent";
import { AddStudentToCourseDialog } from "@/components/courses/students/add-student-to-course-form-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { getLabCourseByIdQueryOptions } from "@/data/labCourse";

const studentsSearchSchema = z.object({
  page: z.number().catch(DEFAULT_PAGE),
  pageSize: z
    .preprocess((val) => Number(val), z.union(PAGE_SIZE_OPTIONS.map((size) => z.literal(size))))
    .catch(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  studyProgram: z.string().optional(),
});

const paramsSchema = z.object({
  courseId: z.coerce.number().int().positive(),
});

export const Route = createFileRoute("/courses/$courseId/students")({
  component: RouteComponent,
  params: {
    parse: (params) => paramsSchema.parse(params),
  },
  validateSearch: (search) => studentsSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ params, context: { queryClient }, deps }) => {
    queryClient.prefetchQuery(filterCourseStudentsQueryOptions(params.courseId, deps));
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const { courseId } = Route.useParams();

  const { data: course } = useSuspenseQuery(getLabCourseByIdQueryOptions(Number(courseId)));

  const [isAddStudentsDialogOpen, setIsAddStudentsDialogOpen] = useState(false);

  const [studyProgramSearchValue, setStudyProgramSearchValue] = useState<string>("");
  const {
    inputValue,
    debouncedValue: debouncedSearchValue,
    setInputValue,
  } = useDebouncedSearch(searchParams.search || "", { delay: 300, minLength: 0 });

  // Update URL when debounced value changes
  useEffect(() => {
    if (debouncedSearchValue !== searchParams.search) {
      navigate({
        search: (prev) => ({ ...prev, search: debouncedSearchValue || undefined }),
        replace: true,
      });
    }
  }, [debouncedSearchValue, searchParams.search, navigate]);

  const { data: studyPrograms, isLoading: isStudyProgramsLoading } = useStudyPrograms();

  const { data: enrolledStudents } = useCourseStudents({
    courseId,
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    search: searchParams.search,
    studyProgramCode: searchParams.studyProgram,
  });

  const [selectedStudentToRemove, setSelectedStudentToRemove] = useState<
    FilterCourseStudentResponse["items"][number] | null
  >(null);
  const isRemoveConfirmOpen = Boolean(selectedStudentToRemove);

  const removeStudentMutation = useRemoveStudentFromCourse(courseId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enrolled Students</CardTitle>
            <CardDescription>Students currently enrolled in this course</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddStudentsDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Students
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="relative">
            <FilterIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <AutoComplete
              selectedValue={searchParams.studyProgram ?? ""}
              onSelectedValueChange={(value) => {
                navigate({
                  search: (prev) => ({ ...prev, studyProgram: value || undefined }),
                  replace: true,
                });
              }}
              searchValue={studyProgramSearchValue}
              onSearchValueChange={setStudyProgramSearchValue}
              items={
                studyPrograms?.map((studyProgram) => ({
                  label: `${studyProgram.code} - ${studyProgram.name}`,
                  value: studyProgram.code,
                })) ?? []
              }
              isLoading={isStudyProgramsLoading}
              placeholder="Study Program"
              inputClassName="pl-8"
              align="end"
            />
          </div>
        </div>

        <div className="space-y-3">
          {enrolledStudents?.items.map((student) => (
            <div
              key={student.index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {student.name} {student.lastName}
                  </h3>
                  <Badge variant="outline">{student.index}</Badge>
                  {student.signatureStatus === "ELIGIBLE" ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Signature{" "}
                      {course.requiredExercisesForSignature !== null && (
                        <span>
                          ({student.labsCompleted}/{course.requiredExercisesForSignature})
                        </span>
                      )}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      No Signature{" "}
                      {course.requiredExercisesForSignature !== null && (
                        <span>
                          ({student.labsCompleted}/{course.requiredExercisesForSignature})
                        </span>
                      )}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span>{student.email}</span>
                  <span>{student.studyProgram.name}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedStudentToRemove(student)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <UserX className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center flex-wrap">
          <PaginationSizeSelect
            defaultValue={searchParams.pageSize}
            onChange={(size) =>
              navigate({
                search: (prev) => ({ ...prev, pageSize: size, page: 1 }),
                replace: true,
              })
            }
          />

          <PaginationControl
            totalItems={enrolledStudents?.count ?? 0}
            itemsPerPage={searchParams.pageSize}
            defaultPage={searchParams.page}
            onChange={(page) => navigate({ search: (prev) => ({ ...prev, page }), replace: true })}
          />
        </div>
      </CardContent>

      <AddStudentToCourseDialog
        courseId={courseId}
        open={isAddStudentsDialogOpen}
        onOpenChange={(isOpen) => setIsAddStudentsDialogOpen(isOpen)}
      />

      <ConfirmDialog
        item={selectedStudentToRemove}
        open={isRemoveConfirmOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedStudentToRemove(null);
        }}
        title="Remove student?"
        description={(student) => (
          <>
            This will remove the student{" "}
            <strong>
              {student?.name} {student?.lastName} ({student?.index})
            </strong>{" "}
            from the course. This action can be undone by re-adding the student.
          </>
        )}
        confirmLabel="Remove Student"
        onConfirm={(student) => {
          removeStudentMutation.mutate(String(student.index));
        }}
      />
    </Card>
  );
}
