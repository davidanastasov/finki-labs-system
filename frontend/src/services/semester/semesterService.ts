import apiClient from "../apiClient";
import type { SemestersResponse } from "./models";

export async function findAll() {
  return await apiClient.get<SemestersResponse>(`api/semesters`).json();
}
