import type { PaginatedResponse } from "@/services/apiClient";

export type LabCourseStatus = "ACTIVE" | "INACTIVE";

export type FilterLabCoursesParams = {
  search?: string;
  semesterCode?: string;
  page?: number;
  pageSize?: number;
};

export type FilterLabCoursesResponse = {
  count: number;
  items: {
    id: number;
    semester: {
      code: string;
      year: string;
      type: string;
    };
    subject: {
      abbreviation: string;
      code: string;
      name: string;
    };
    description: string;
    professors: {
      id: string;
      name: string;
    }[];
    assistants: {
      id: string;
      name: string;
    }[];
    status: LabCourseStatus;
    enrolledStudentsCount: number;
  }[];
};

export type LabCourseResponse = {
  id: number;
  semester: {
    code: string;
    year: string;
    type: string;
  };
  subject: {
    abbreviation: string;
    code: string;
    name: string;
  };
  description: string;
  professors: {
    id: string;
    name: string;
  }[];
  assistants: {
    id: string;
    name: string;
  }[];
  status: LabCourseStatus;
  enrolledStudentsCount: number;
};

export type CreateLabCourseRequest = {
  semesterCode: string;
  subjectAbbreviation: string;
  description?: string;
  professorIds: string[];
  assistantIds?: string[];
  status?: LabCourseStatus;
};

export type UpdateLabCourseRequest = {
  id: number;
  semesterCode: string;
  subjectAbbreviation: string;
  description?: string;
  professorIds: string[];
  assistantIds?: string[];
  status?: LabCourseStatus;
};

export type FilterCourseStudentParams = {
  search?: string;
  studyProgramCode?: string;
  page?: number;
  pageSize?: number;
};

export type FilterCourseStudentResponse = PaginatedResponse<{
  index: string;
  email: string;
  name: string;
  lastName: string;
  parentName: string;
  studyProgram: {
    code: string;
    name: string;
  };
}>;

export type AddStudentsToLabCourseRequest = {
  studentIds: string[];
};
