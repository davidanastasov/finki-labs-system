export type ProfessorTitle =
  | "TUTOR"
  | "TEACHING_ASSISTANT"
  | "ASSISTANT_PROFESSOR"
  | "ASSOCIATE_PROFESSOR"
  | "PROFESSOR"
  | "RETIRED"
  | "ELECTED_ASSISTANT_PROFESSOR"
  | "ELECTED_ASSOCIATE_PROFESSOR"
  | "ELECTED_PROFESSOR"
  | "EXTERNAL_EXPERT";

export type ProfessorsResponse = {
  id: string;
  name: string;
  email: string;
  title: ProfessorTitle;
}[];
