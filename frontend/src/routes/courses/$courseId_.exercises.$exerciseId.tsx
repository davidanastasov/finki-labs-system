import { Link, createFileRoute } from "@tanstack/react-router";
import z from "zod";

import { ArrowLeft, Calendar, Download, FileText } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ExerciseFile } from "@/services/exercise";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExerciseByIdQueryOptions } from "@/data/labCourseExercise";
import { formatDate } from "@/lib/date";
import { capitalize } from "@/lib/utils";
import { ExerciseDescriptionPreview } from "@/components/exercises/exercise-description-preview";
import { downloadFile } from "@/services/exercise/exerciseService";
import { downloadBlob } from "@/lib/file";
import { getStatusColor } from "@/lib/theme";
import { StudentExerciseScoring } from "@/components/exercises/scoring/exercise-scoring";
import { Separator } from "@/components/ui/separator";

const paramsSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  exerciseId: z.coerce.number().int().positive(),
});

export const Route = createFileRoute("/courses/$courseId_/exercises/$exerciseId")({
  component: RouteComponent,
  params: {
    parse: (params) => paramsSchema.parse(params),
  },
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(getExerciseByIdQueryOptions(params.courseId, params.exerciseId)),
});

function RouteComponent() {
  const params = Route.useParams();

  const { data: exercise } = useSuspenseQuery(
    getExerciseByIdQueryOptions(params.courseId, params.exerciseId),
  );

  const handleDownloadFile = async (file: ExerciseFile) => {
    const dataBlob = await downloadFile(file.id);
    downloadBlob(dataBlob, file.fileName);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/courses/$courseId/exercises" params={{ courseId: exercise.course.id }}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-sans">{exercise.title}</h1>
          <p className="text-muted-foreground font-serif">
            {exercise.course.year} - {exercise.course.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Date</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(new Date(exercise.labDate!))}</div>
            <p className="text-xs text-muted-foreground">Published date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(new Date(exercise.dueDate!))}</div>
            <p className="text-xs text-muted-foreground">Submission deadline</p>
          </CardContent>
        </Card>
        <Card className="justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className={getStatusColor(exercise.status)}>
              {capitalize(exercise.status)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Current status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-auto">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            {exercise.description ? (
              <ExerciseDescriptionPreview content={exercise.description} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No description available for this exercise.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materials & Files ({exercise.files.length})</CardTitle>
            <CardDescription>Materials for the lab exercise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {exercise.files.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No files attached for this exercise.
              </p>
            ) : (
              exercise.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 gap-2 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">{file.fileName}</h4>
                      <p className="text-sm text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleDownloadFile(file)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <StudentExerciseScoring courseId={params.courseId} exerciseId={params.exerciseId} />
    </div>
  );
}
