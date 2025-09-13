import type { CreateExerciseRequest, ExerciseResponse, UpdateExerciseRequest } from "./models";
import apiClient from "@/services/apiClient";

export const findByLabCourseId = async (labCourseId: number) => {
  return await apiClient.get<ExerciseResponse[]>(`api/exercises/lab-course/${labCourseId}`).json();
};

export const findById = async (id: number) => {
  return await apiClient.get<ExerciseResponse>(`api/exercises/${id}`).json();
};

export const create = async (data: CreateExerciseRequest, files?: File[]) => {
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

  return await apiClient.post<ExerciseResponse>("api/exercises", { body: formData }).json();
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
    .put<ExerciseResponse>(`api/exercises/${data.id}`, { body: formData })
    .json();
};

export const deleteById = async (id: number) => {
  await apiClient.delete(`api/exercises/${id}`);
};

export const downloadFile = async (fileId: string) => {
  return await apiClient.get(`api/exercises/files/${fileId}/download`).blob();
};
