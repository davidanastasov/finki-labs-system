import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import type { AddStudentsToLabCourseRequest } from "@/services/lab-course";
import labCourseService from "@/services/lab-course";

export const filterCourseStudentsQueryOptions = (
  courseId: number,
  params: Parameters<typeof labCourseService.filterCourseStudents>[1],
) => {
  return queryOptions({
    queryKey: ["lab-courses", courseId, "students", params],
    queryFn: () => labCourseService.filterCourseStudents(courseId, params),
    gcTime: 5 * 1000, // 5 seconds
  });
};

type UseCourseStudentsOptions = {
  courseId: number;
  search?: string;
  studyProgramCode?: string;
  page?: number;
  pageSize?: number;
  queryConfig?: QueryConfig<typeof filterCourseStudentsQueryOptions>;
};

export const useCourseStudents = ({
  courseId,
  search,
  studyProgramCode,
  page,
  pageSize,
  queryConfig,
}: UseCourseStudentsOptions) => {
  return useQuery({
    ...filterCourseStudentsQueryOptions(courseId, { search, studyProgramCode, page, pageSize }),
    ...queryConfig,
  });
};

export const useAddStudentsToLabCourse = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddStudentsToLabCourseRequest) =>
      labCourseService.addStudentsToLabCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-courses", courseId, "students"] });
    },
  });
};

export const useRemoveStudentFromCourse = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentIndex: string) =>
      labCourseService.useRemoveStudentFromCourse(courseId, studentIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-courses", courseId, "students"] });
    },
  });
};
