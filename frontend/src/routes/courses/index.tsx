import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FilterIcon, Plus, Search, Users } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import PaginationControl from "@/components/pagination/pagination-control";
import PaginationSizeSelect from "@/components/pagination/pagination-size-select";
import { CourseTable } from "@/components/courses/course-table";
import { CourseDialog } from "@/components/courses/course-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingWrapper } from "@/components/loaders/loading-wrapper";
import { getLabCoursesFilterQueryOptions, useLabCoursesFilter } from "@/data/labCourse";
import { getAllSemestersQueryOptions } from "@/data/semester";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { getAllSubjectsQueryOptions } from "@/data/subject";
import { capitalize } from "@/lib/utils";

const coursesSearchSchema = z.object({
  page: z.number().catch(DEFAULT_PAGE),
  pageSize: z
    .preprocess((val) => Number(val), z.union(PAGE_SIZE_OPTIONS.map((size) => z.literal(size))))
    .catch(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  semester: z.string().optional(),
});

export const Route = createFileRoute("/courses/")({
  component: RouteComponent,
  validateSearch: (search) => coursesSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.prefetchQuery(getLabCoursesFilterQueryOptions(deps));

    return Promise.allSettled([
      queryClient.ensureQueryData(getAllSubjectsQueryOptions()),
      queryClient.ensureQueryData(getAllSemestersQueryOptions()),
    ]);
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
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

  const { data: semesters } = useSuspenseQuery(getAllSemestersQueryOptions());
  const { data: courses, isLoading: isCoursesLoading } = useLabCoursesFilter({
    params: {
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      search: searchParams.search,
      semesterCode: searchParams.semester,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-sans">Course Management</h1>
          <p className="text-muted-foreground font-serif">Manage laboratory courses</p>
        </div>
        <Button onClick={() => setIsNewCourseOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <LoadingWrapper
              isLoading={isCoursesLoading}
              fallback={<Skeleton className="h-8 w-16" />}
            >
              <div className="text-2xl font-bold">{courses?.count ?? 0}</div>
            </LoadingWrapper>
            <p className="text-xs text-muted-foreground">Across all semesters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingWrapper
              isLoading={isCoursesLoading}
              fallback={<Skeleton className="h-8 w-16" />}
            >
              <div className="text-2xl font-bold">
                {courses?.items.filter((c) => c.status === "ACTIVE").length ?? 0}
              </div>
            </LoadingWrapper>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingWrapper
              isLoading={isCoursesLoading}
              fallback={<Skeleton className="h-8 w-16" />}
            >
              <div className="text-2xl font-bold">
                {courses?.items.reduce(
                  (total, course) => total + course.enrolledStudentsCount,
                  0,
                ) ?? 0}
              </div>
            </LoadingWrapper>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>View and manage laboratory courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses by subject code, abbreviation, or name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="relative">
              <FilterIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Select
                value={searchParams.semester ?? "all"}
                onValueChange={(value) => {
                  navigate({
                    search: (prev) => ({ ...prev, semester: value === "all" ? undefined : value }),
                    replace: true,
                  });
                }}
              >
                <SelectTrigger className="w-48 pl-8">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.code} value={semester.code}>
                      {semester.year} - {capitalize(semester.semesterType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <CourseTable
            courses={
              courses?.items.map((course) => ({
                id: course.id,
                code: course.subject.code,
                name: course.subject.name,
                semester: course.semester.type,
                academicYear: course.semester.year,
                professors: course.professors.map((p) => p.name),
                assistants: course.assistants.map((a) => a.name),
                enrolledStudents: course.enrolledStudentsCount,
                status: course.status,
              })) || []
            }
            isLoading={isCoursesLoading}
            pageSize={searchParams.pageSize}
          />

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
              totalItems={courses?.count ?? 0}
              itemsPerPage={searchParams.pageSize}
              defaultPage={searchParams.page}
              onChange={(page) =>
                navigate({ search: (prev) => ({ ...prev, page }), replace: true })
              }
            />
          </div>
        </CardContent>
      </Card>

      <CourseDialog open={isNewCourseOpen} onOpenChange={setIsNewCourseOpen} />
    </div>
  );
}
