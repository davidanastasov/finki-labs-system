import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FilterIcon, Search, Users } from "lucide-react";
import PaginationControl from "@/components/pagination/pagination-control";
import PaginationSizeSelect from "@/components/pagination/pagination-size-select";
import { StudentTable } from "@/components/students/student-table";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingWrapper } from "@/components/loaders/loading-wrapper";
import { useStudents } from "@/data/student";
import { useStudyPrograms } from "@/data/studyProgram";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";

const studentsSearchSchema = z.object({
  page: z.number().catch(DEFAULT_PAGE),
  pageSize: z
    .preprocess((val) => Number(val), z.union(PAGE_SIZE_OPTIONS.map((size) => z.literal(size))))
    .catch(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  studyProgram: z.string().optional(),
});

export const Route = createFileRoute("/students/")({
  component: RouteComponent,
  validateSearch: (search) => studentsSearchSchema.parse(search),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

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
  const { data: students, isLoading: isStudentsLoading } = useStudents({
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    search: searchParams.search,
    studyProgramCode: searchParams.studyProgram,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-sans">Student Management</h1>
          <p className="text-muted-foreground font-serif">Manage students and course enrollments</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <LoadingWrapper
              isLoading={isStudentsLoading}
              fallback={<Skeleton className="h-8 w-16" />}
            >
              <div className="text-2xl font-bold">{students?.count ?? 0}</div>
            </LoadingWrapper>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingWrapper
              isLoading={isStudyProgramsLoading}
              fallback={<Skeleton className="h-8 w-16" />}
            >
              <div className="text-2xl font-bold">{studyPrograms?.length ?? 0}</div>
            </LoadingWrapper>
            <p className="text-xs text-muted-foreground">Different programs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>View and manage all students in the system</CardDescription>
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

          <StudentTable
            students={
              students?.items.map((student) => ({
                firstName: student.name,
                lastName: student.lastName,
                email: student.email,
                studyTrack: student.studyProgram.name,
                id: student.index,
                indexNumber: student.index,
                enrolledCoursesCount: 0,
              })) || []
            }
            isLoading={isStudentsLoading}
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
              totalItems={students?.count ?? 0}
              itemsPerPage={searchParams.pageSize}
              defaultPage={searchParams.page}
              onChange={(page) =>
                navigate({ search: (prev) => ({ ...prev, page }), replace: true })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
