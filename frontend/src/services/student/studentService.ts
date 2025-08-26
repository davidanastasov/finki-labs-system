import apiClient from "../apiClient";
import type { FilterStudentsResponse } from "./models";

export async function filter(
  search: string = "",
  studyProgramCode: string = "",
  pageNum: number = 1,
  pageSize: number = 10,
) {
  return await apiClient
    .get<FilterStudentsResponse>(`api/students/filter`, {
      searchParams: { search, studyProgramCode, pageNum, pageSize },
    })
    .json();
}
