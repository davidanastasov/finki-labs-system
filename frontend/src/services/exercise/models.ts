export interface ExerciseFile {
  id: string;
  fileName: string;
  size: number;
  contentType: string;
}

export interface ExerciseResponse {
  id: number;
  title: string;
  description?: string;
  labDate?: string;
  dueDate?: string;
  totalPoints: number;
  labCourseId: number;
  status: ExerciseStatus;
  files: ExerciseFile[];
}

export interface ExerciseDetailsResponse {
  id: number;
  title: string;
  description?: string;
  labDate?: string;
  dueDate?: string;
  totalPoints: number;
  status: ExerciseStatus;
  files: ExerciseFile[];
  course: {
    id: number;
    abbreviation: string;
    name: string;
    code: string;
    year: number;
  };
}

export interface CreateExerciseRequest {
  title: string;
  description?: string;
  labDate?: string;
  dueDate?: string;
  totalPoints: number;
  status?: ExerciseStatus;
}

export interface UpdateExerciseRequest {
  id: number;
  title?: string;
  description?: string;
  labDate?: string;
  dueDate?: string;
  totalPoints?: number;
  status?: ExerciseStatus;
}

export enum ExerciseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

// ========== Student Exercise Score Models ==========

export interface StudentExerciseScore {
  id: number;
  studentIndex: string;
  studentName: string;
  exerciseId: number;
  exerciseTitle: string;
  corePoints: number;
  dateGraded: string;
  gradedByName?: string;
}

export interface UpdateStudentScoreRequest {
  studentIndex: string;
  corePoints: number;
}

export interface BulkUpdateScoresRequest {
  scores: UpdateStudentScoreRequest[];
}
