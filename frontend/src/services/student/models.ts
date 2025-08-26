import type { PaginatedResponse } from "../apiClient";

export type FilterStudentsResponse = PaginatedResponse<
  {
    index: string;
    email: string;
    name: string;
    lastName: string;
    parentName: string;
    studyProgram: {
      code: string;
      name: string;
    };
  }[]
>;
