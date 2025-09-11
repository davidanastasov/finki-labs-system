export enum SemesterType {
  WINTER = "WINTER",
  SUMMER = "SUMMER",
}

export type Subject = {
  code: string;
  name: string;
  abbreviation: string;
  semester: SemesterType;
};

export type SubjectsResponse = Subject[];
