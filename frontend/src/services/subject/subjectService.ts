import apiClient from "../apiClient";
import type { SubjectsResponse } from "./models";

export async function findAll() {
  return await apiClient.get<SubjectsResponse>(`api/subjects`).json();
}
