import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FlaskConical, TrendingUp, Users } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ExerciseResponse, StudentExerciseScore } from "@/services/exercise";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLabCoursesFilter } from "@/data/labCourse";
import { LoadingWrapper } from "@/components/loaders/loading-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { findByLabCourseId, getExerciseScores } from "@/services/exercise/exerciseService";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: courses, isLoading: isCoursesLoading } = useLabCoursesFilter({
    params: {
      pageSize: 100,
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
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + s.corePoints, 0);
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
  const scoresMap: Record<number, StudentExerciseScore[]> = Object.fromEntries(
    exercises.map((exercise, index) => [exercise.id, scoresQueries[index]?.data ?? []]),
  );

  const coursesWithExercises =
    courses?.items.filter((course) =>
      exerciseQueries.some((q) => q.data?.some((e) => e.labCourseId === course.id)),
    ) ?? [];

  const courseStats = coursesWithExercises.map((course) => {
    const exercisesMap = Object.fromEntries(
      exerciseQueries.map((q, index) => [courses?.items[index]?.id, q.data ?? []]),
    );

    const exercisesForCourse = exercisesMap[course.id] ?? [];

    const scoresForCourse = scoresQueries
      .flatMap((q) => q.data ?? [])
      .filter((score) =>
        exercisesForCourse.some((ex: ExerciseResponse) => ex.id === score.exerciseId),
      );
    const average = scoresForCourse.length
      ? scoresForCourse.reduce((sum, s) => sum + s.corePoints, 0) / scoresForCourse.length
      : 0;

    const maxScore = exercisesForCourse.reduce(
      (sum: number, exercise: ExerciseResponse) => sum + exercise.totalPoints,
      0,
    );

    // Подготовка за график
    const chartData = exercisesForCourse.map((exercise: ExerciseResponse) => {
      const scoresForExercise = scoresMap[exercise.id] ?? [];
      return {
        exercise: exercise.title,
        totalPoints: scoresForExercise.reduce((sum, s) => sum + s.corePoints, 0),
        students: scoresForExercise.length,
      };
    });

    return { course, average, maxScore, chartData };
  });

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
            <div className="text-2xl font-bold">{courses?.items.length || 0}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
              {allScores.length} exercise{allScores.length !== 1 ? "s" : ""} graded in all courses
            </p>
          </CardContent>
        </Card>
      </div>
      {courseStats.map(({ course, average, maxScore, chartData }) => (
        <div key={course.id} className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">{course.subject.name}</h2>

          <div className="grid gap-2 md:grid-cols-4">
            {/* Лева половина: 1/4 од ширината */}
            <div className="flex flex-col gap-2 col-span-1 h-full">
              <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-full">
                  <div className="text-2xl font-bold">{average.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    Average score of all labs in this course
                  </p>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Max Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-full">
                  <div className="text-2xl font-bold">{maxScore}</div>
                  <p className="text-xs text-muted-foreground">Maximum score in this course</p>
                </CardContent>
              </Card>
            </div>

            {/* Десна половина: 3/4 од ширината */}
            <Card className="h-full col-span-3">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Distribution of Students and Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="exercise" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalPoints" fill="#74c69d" name="Total Points" />
                    <Bar dataKey="students" fill="#38a3a5" name="Students Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
