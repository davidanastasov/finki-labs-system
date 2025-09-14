import type { ExerciseStatus } from "@/services/exercise";

export const getStatusColor = (status: ExerciseStatus) => {
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
