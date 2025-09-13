import type { CreateExerciseRequest, ExerciseResponse, UpdateExerciseRequest } from "./models";
import apiClient from "@/services/apiClient";

export const findByLabCourseId = async (labCourseId: number) => {
  return await apiClient.get<ExerciseResponse[]>(`api/exercises/lab-course/${labCourseId}`).json();
};

export const findById = async (id: number) => {
  return await apiClient.get<ExerciseResponse>(`api/exercises/${id}`).json();
};

export const create = async (data: CreateExerciseRequest) => {
  return await apiClient.post<ExerciseResponse>("api/exercises", { json: data }).json();
};

export const update = async (data: UpdateExerciseRequest) => {
  return await apiClient.put<ExerciseResponse>(`api/exercises/${data.id}`, { json: data }).json();
};

export const deleteById = async (id: number) => {
  await apiClient.delete(`api/exercises/${id}`);
};
