import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Users, TrendingUp, User } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { getLabCoursesFilterQueryOptions, useLabCoursesFilter } from "@/data/labCourse";
import { getAllSemestersQueryOptions } from "@/data/semester";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { LoadingWrapper } from "@/components/loaders/loading-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
// queries/labs.ts
import { useQueries } from "@tanstack/react-query";
import { findByLabCourseId, getExerciseScores } from "@/services/exercise/exerciseService";
import { FlaskConical } from "lucide-react";
import type { StudentExerciseScore } from "@/services/exercise";
import z from "zod";

// ...
const coursesSearchSchema = z.object({
  page: z.number().catch(DEFAULT_PAGE),
  pageSize: z
    .preprocess((val) => Number(val), z.union(PAGE_SIZE_OPTIONS.map((size) => z.literal(size))))
    .catch(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  semester: z.string().optional(),
});

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  validateSearch: (search) => coursesSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.prefetchQuery(getLabCoursesFilterQueryOptions(deps));
    return Promise.allSettled([queryClient.ensureQueryData(getAllSemestersQueryOptions())]);
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

  const { debouncedValue: debouncedSearchValue } = useDebouncedSearch(searchParams.search || "", {
    delay: 300,
    minLength: 0,
  });

  useEffect(() => {
    if (debouncedSearchValue !== searchParams.search) {
      navigate({
        search: (prev) => ({ ...prev, search: debouncedSearchValue || undefined }),
        replace: true,
      });
    }
  }, [debouncedSearchValue, searchParams.search, navigate]);

  const {} = useSuspenseQuery(getAllSemestersQueryOptions());

  const { data: courses, isLoading: isCoursesLoading } = useLabCoursesFilter({
    params: {
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      search: searchParams.search,
      semesterCode: searchParams.semester,
    },
  });

  // за секој course пуштаме query за неговите exercises
  const exerciseQueries = useQueries({
    queries: (courses?.items ?? []).map((course) => ({
      queryKey: ["exercises", course.id],
      queryFn: () => findByLabCourseId(course.id),
      enabled: !!course.id,
    })),
  });

  const totalExercises = exerciseQueries.reduce((sum, q) => sum + (q.data?.length ?? 0), 0);
  const isExercisesLoading = exerciseQueries.some((q) => q.isLoading);

  const calculateAverageScore = (scores: StudentExerciseScore[]) => {
    if (!scores || scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + (s.corePoints ?? 0), 0);
    return total / scores.length;
  };

  const exercises = exerciseQueries.flatMap((q) => q.data ?? []);
  const scoresQueries = useQueries({
    queries: exercises.map((exercise) => ({
      queryKey: ["exerciseScores", exercise.id],
      queryFn: () => getExerciseScores(exercise.id),
      enabled: !!exercise.id,
    })),
  });

  const allScores = scoresQueries.flatMap((q) => q.data ?? []).filter(Boolean);
  const averageScore = allScores.length > 0 ? calculateAverageScore(allScores).toFixed(1) : "0";
  const isScoresLoading = scoresQueries.some((q) => q.isLoading);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-sans">Dashboard and Statistics</h1>
        <p className="text-muted-foreground font-serif">
          Overview and statistics for easy data tracking and analysis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.items?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Labs</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isExercisesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalExercises}</div>
            )}
            <p className="text-xs text-muted-foreground">Exercises in all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isScoresLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{averageScore}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {allScores.length} exercise{allScores.length !== 1 ? "s" : ""} graded
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
