import type {
  BulkUpdateScoresRequest,
  CreateExerciseRequest,
  ExerciseDetailsResponse,
  ExerciseResponse,
  StudentExerciseScore,
  UpdateExerciseRequest,
  UpdateStudentScoreRequest,
} from "./models";
import apiClient from "@/services/apiClient";

export const findByLabCourseId = async (courseId: number) => {
  return await apiClient.get<ExerciseResponse[]>(`api/lab-courses/${courseId}/exercises`).json();
};

export const findById = async (id: number) => {
  return await apiClient.get<ExerciseDetailsResponse>(`api/exercises/${id}`).json();
};

export const create = async (courseId: number, data: CreateExerciseRequest, files?: File[]) => {
  const formData = new FormData();

  // Add exercise data
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  // Add files
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return await apiClient
    .post<ExerciseDetailsResponse>(`api/lab-courses/${courseId}/exercises`, { body: formData })
    .json();
};

export const update = async (
  data: UpdateExerciseRequest,
  files?: File[],
  removeFiles?: string[],
) => {
  const formData = new FormData();

  // Add exercise data
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== "id") {
      formData.append(key, value.toString());
    }
  });

  // Add files
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  // Add files to remove
  if (removeFiles && removeFiles.length > 0) {
    removeFiles.forEach((fileName) => {
      formData.append("removeFiles", fileName);
    });
  }

  return await apiClient
    .put<ExerciseDetailsResponse>(`api/exercises/${data.id}`, { body: formData })
    .json();
};

export const deleteById = async (id: number) => {
  await apiClient.delete(`api/exercises/${id}`);
};

export const downloadFile = async (fileId: string) => {
  return await apiClient.get(`api/exercises/files/${fileId}/download`).blob();
};

// ========== Student Exercise Score Functions ==========

export const getExerciseScores = async (exerciseId: number) => {
  return await apiClient.get<StudentExerciseScore[]>(`api/exercises/${exerciseId}/scores`).json();
};

export const updateStudentScore = async (
  exerciseId: number,
  studentIndex: string,
  data: UpdateStudentScoreRequest,
) => {
  return await apiClient
    .put<StudentExerciseScore>(`api/exercises/${exerciseId}/scores/student/${studentIndex}`, {
      json: data,
    })
    .json();
};

export const bulkUpdateScores = async (exerciseId: number, data: BulkUpdateScoresRequest) => {
  return await apiClient
    .put<StudentExerciseScore[]>(`api/exercises/${exerciseId}/scores/bulk`, { json: data })
    .json();
};

export const deleteStudentScore = async (exerciseId: number, studentIndex: string) => {
  await apiClient.delete(`api/exercises/${exerciseId}/scores/student/${studentIndex}`);
};
