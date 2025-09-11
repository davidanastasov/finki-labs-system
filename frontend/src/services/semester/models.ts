export type SemesterType = "WINTER" | "SUMMER";

export type SemestersResponse = {
  code: string;
  year: string;
  semesterType: SemesterType;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
}[];
