import { Edit, Eye, Trash2 } from "lucide-react";
import type { ExerciseResponse, ExerciseStatus } from "@/services/exercise/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";

interface ExerciseCardProps {
  exercise: ExerciseResponse;
  onEdit?: (exercise: ExerciseResponse) => void;
  onView?: (exercise: ExerciseResponse) => void;
  onDelete?: (exercise: ExerciseResponse) => void;
}

const getStatusColor = (status: ExerciseStatus) => {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "DRAFT":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "ARCHIVED":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const formatDateWithFallback = (dateString?: string) => {
  if (!dateString) return "Not set";
  return formatDate(new Date(dateString));
};

export function ExerciseCard({ exercise, onEdit, onView, onDelete }: ExerciseCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold">{exercise.title}</h3>
          <Badge variant="secondary" className={getStatusColor(exercise.status)}>
            {exercise.status.toLowerCase()}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {exercise.labDate && <span>Lab: {formatDateWithFallback(exercise.labDate)}</span>}
          {exercise.dueDate && <span>Due: {formatDateWithFallback(exercise.dueDate)}</span>}
          <span>Points: {exercise.totalPoints}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(exercise)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(exercise)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(exercise)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
