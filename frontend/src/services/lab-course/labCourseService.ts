import type {
  CreateLabCourseRequest,
  LabCourseResponse,
  LabCoursesResponse,
  UpdateLabCourseRequest,
} from "./models";
import apiClient from "@/services/apiClient";

export const findAll = async (params?: { semesterCode?: string; subjectAbbreviation?: string }) => {
  const searchParams = new URLSearchParams();

  if (params?.semesterCode) {
    searchParams.append("semesterCode", params.semesterCode);
  }

  if (params?.subjectAbbreviation) {
    searchParams.append("subjectAbbreviation", params.subjectAbbreviation);
  }

  const url = `api/lab-courses${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  return await apiClient.get<LabCoursesResponse>(url).json();
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
