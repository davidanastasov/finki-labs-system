export interface ExerciseResponse {
  id: number;
  title: string;
  description?: string;
  labDate?: string;
  dueDate?: string;
  totalPoints: number;
  filePath?: string;
  labCourseId: number;
  status: ExerciseStatus;
}

export interface CreateExerciseRequest {
  title: string;
  description?: string;
  labDate?: string;
  dueDate?: string;
  totalPoints: number;
  filePath?: string;
  labCourseId: number;
  status?: ExerciseStatus;
}

export interface UpdateExerciseRequest {
  id: number;
  title?: string;
  description?: string;
  labDate?: string;
  dueDate?: string;
  totalPoints?: number;
  filePath?: string;
  status?: ExerciseStatus;
}

export enum ExerciseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}
