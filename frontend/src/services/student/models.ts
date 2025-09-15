import type { PaginatedResponse } from "../apiClient";

export type FilterStudentsParams = {
  search?: string;
  studyProgramCode?: string;
  page?: number;
  pageSize?: number;
};

export type FilterStudentsResponse = PaginatedResponse<{
  index: string;
  email: string;
  name: string;
  lastName: string;
  parentName: string;
  studyProgram: {
    code: string;
    name: string;
  };
  coursesCount: number;
}>;
