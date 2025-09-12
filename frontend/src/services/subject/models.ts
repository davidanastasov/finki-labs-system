export type SemesterType = "WINTER" | "SUMMER";

export type SubjectsResponse = {
  code: string;
  name: string;
  abbreviation: string;
  semester: SemesterType;
}[];
