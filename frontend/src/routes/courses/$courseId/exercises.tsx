import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ExerciseResponse } from "@/services/exercise/models";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getExercisesByLabCourseIdQueryOptions, useDeleteExercise } from "@/data/labCourseExercise";
import { ExerciseDialog } from "@/components/exercises/exercise-form-dialog";
import { ExerciseList } from "@/components/exercises/exercise-list";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export const Route = createFileRoute("/courses/$courseId/exercises")({
  component: CourseLabsComponent,
  loader: ({ params, context: { queryClient } }) =>
    Promise.allSettled([
      queryClient.ensureQueryData(getExercisesByLabCourseIdQueryOptions(params.courseId)),
    ]),
});

function CourseLabsComponent() {
  const { courseId } = Route.useParams();
  const navigate = Route.useNavigate();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseResponse | null>(null);
  const [deletingExercise, setDeletingExercise] = useState<ExerciseResponse | null>(null);

  const { data: exercises } = useSuspenseQuery(getExercisesByLabCourseIdQueryOptions(courseId));
  const deleteExerciseMutation = useDeleteExercise(courseId);

  const handleEdit = (exercise: ExerciseResponse) => {
    setEditingExercise(exercise);
  };

  const handleView = (exercise: ExerciseResponse) => {
    navigate({
      to: `/courses/$courseId/exercises/$exerciseId`,
      params: { courseId, exerciseId: exercise.id },
    });
  };

  const handleDelete = (exercise: ExerciseResponse) => {
    setDeletingExercise(exercise);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lab Exercises</CardTitle>
            <CardDescription>Manage laboratory exercises for this course</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Exercise
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ExerciseList
          exercises={exercises}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      </CardContent>

      {/* Create dialog */}
      <ExerciseDialog
        labCourseId={courseId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* Edit dialog */}
      <ExerciseDialog
        exerciseId={editingExercise?.id}
        labCourseId={courseId}
        open={!!editingExercise}
        onOpenChange={(open) => !open && setEditingExercise(null)}
      />

      <ConfirmDialog
        item={deletingExercise}
        open={!!deletingExercise}
        onOpenChange={(open) => !open && setDeletingExercise(null)}
        title="Delete Exercise"
        description={(exercise) => (
          <>
            Are you sure you want to delete the exercise <strong>"{exercise?.title}"</strong>? This
            action cannot be undone.
          </>
        )}
        confirmLabel="Delete"
        onConfirm={(exercise) => {
          deleteExerciseMutation.mutate(exercise.id, {
            onSuccess: () => {
              setDeletingExercise(null);
            },
          });
        }}
      />
    </Card>
  );
}
