import apiClient from "../apiClient";
import type { StudyProgramsResponse } from "./models";

export async function findAll() {
  return await apiClient.get<StudyProgramsResponse>(`api/study-programs`).json();
}
