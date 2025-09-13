import { ExerciseCard } from "./exercise-card";
import type { ExerciseResponse } from "@/services/exercise/models";

interface ExerciseListProps {
  exercises: ExerciseResponse[];
  onEdit?: (exercise: ExerciseResponse) => void;
  onView?: (exercise: ExerciseResponse) => void;
  onDelete?: (exercise: ExerciseResponse) => void;
}

export function ExerciseList({ exercises, onEdit, onView, onDelete }: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No exercises found for this course.</p>
        <p className="text-sm mt-1">Create your first exercise to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
