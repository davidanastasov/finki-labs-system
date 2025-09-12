import apiClient from "../apiClient";
import type { ProfessorsResponse } from "./models";

export async function findAll() {
  return await apiClient.get<ProfessorsResponse>(`api/professors`).json();
}
