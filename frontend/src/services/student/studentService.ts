import apiClient from "../apiClient";
import type { FilterStudentsParams, FilterStudentsResponse } from "./models";

export async function filter({ search, studyProgramCode, page, pageSize }: FilterStudentsParams) {
  const searchParams = new URLSearchParams();

  if (search) searchParams.set("search", search);
  if (studyProgramCode) searchParams.set("studyProgramCode", studyProgramCode);
  if (page !== undefined) searchParams.set("page", String(page));
  if (pageSize !== undefined) searchParams.set("pageSize", String(pageSize));

  return await apiClient
    .get<FilterStudentsResponse>(`api/students/filter`, { searchParams })
    .json();
}
