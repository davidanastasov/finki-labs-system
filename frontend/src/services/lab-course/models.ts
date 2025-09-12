export type LabCourseStatus = "ACTIVE" | "INACTIVE";

export type LabCoursesResponse = {
  id: number;
  semester: {
    code: string;
    year: string;
    type: string;
  };
  subject: {
    abbreviation: string;
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
}[];

export type LabCourseResponse = {
  id: number;
  semester: {
    code: string;
    year: string;
    type: string;
  };
  subject: {
    abbreviation: string;
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
