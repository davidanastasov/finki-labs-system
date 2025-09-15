import type {
  AddStudentsToLabCourseRequest,
  CreateLabCourseRequest,
  FilterCourseStudentParams,
  FilterCourseStudentResponse,
  FilterLabCoursesParams,
  FilterLabCoursesResponse,
  LabCourseResponse,
  UpdateLabCourseRequest,
} from "./models";
import apiClient from "@/services/apiClient";

export const filter = async (params: FilterLabCoursesParams) => {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.append("search", params.search);
  if (params.semesterCode) searchParams.append("semesterCode", params.semesterCode);
  if (params.page !== undefined) searchParams.append("page", params.page.toString());
  if (params.pageSize !== undefined) searchParams.append("pageSize", params.pageSize.toString());

  return await apiClient
    .get<FilterLabCoursesResponse>(`api/lab-courses/filter`, { searchParams })
    .json();
};

export const findById = async (id: number) => {
  return await apiClient.get<LabCourseResponse>(`api/lab-courses/${id}`).json();
};

export const create = async (data: CreateLabCourseRequest) => {
  return await apiClient.post<LabCourseResponse>("api/lab-courses", { json: data }).json();
};

export const update = async (data: UpdateLabCourseRequest) => {
  return await apiClient
    .put<LabCourseResponse>(`api/lab-courses/${data.id}`, { json: data })
    .json();
};

export const deleteById = async (id: number) => {
  await apiClient.delete(`api/lab-courses/${id}`);
};

export async function filterCourseStudents(
  courseId: number,
  { search, studyProgramCode, page, pageSize }: FilterCourseStudentParams,
) {
  const searchParams = new URLSearchParams();

  if (search) searchParams.set("search", search);
  if (studyProgramCode) searchParams.set("studyProgramCode", studyProgramCode);
  if (page !== undefined) searchParams.set("page", String(page));
  if (pageSize !== undefined) searchParams.set("pageSize", String(pageSize));

  return await apiClient
    .get<FilterCourseStudentResponse>(`api/lab-courses/${courseId}/students/filter`, {
      searchParams,
    })
    .json();
}

export const addStudentsToLabCourse = async (
  courseId: number,
  data: AddStudentsToLabCourseRequest,
) => {
  return await apiClient.post(`api/lab-courses/${courseId}/students`, { json: data }).json();
};

export const useRemoveStudentFromCourse = async (courseId: number, studentIndex: string) => {
  return await apiClient.delete(`api/lab-courses/${courseId}/students/${studentIndex}`).json();
};

export const getStudentsWithSignatureStatus = (courseId: number) =>
  apiClient.get(`api/lab-courses/${courseId}/students`).json<FilterCourseStudentResponse>();

export const updateSignatureForCourse = (courseId: number) =>
  apiClient.post(`api/lab-courses/${courseId}/update-signature`);

export const updateSignatureRequirement = (courseId: number, requiredExercises: number) =>
  apiClient.put(`/api/lab-courses/${courseId}/update-signature-requirement`, {
    json: { requiredExercises },
  });
