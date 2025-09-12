import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import type { CreateLabCourseRequest, UpdateLabCourseRequest } from "@/services/lab-course/models";
import labCourseService from "@/services/lab-course";

// Query options
export const getAllLabCoursesQueryOptions = (params?: {
  semesterCode?: string;
  subjectAbbreviation?: string;
}) => {
  return queryOptions({
    queryKey: ["lab-courses", params],
    queryFn: () => labCourseService.findAll(params),
  });
};

export const getLabCourseByIdQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["lab-courses", id],
    queryFn: () => labCourseService.findById(id),
  });
};

// Hooks
type UseLabCoursesOptions = {
  params?: {
    semesterCode?: string;
    subjectAbbreviation?: string;
  };
  queryConfig?: QueryConfig<typeof getAllLabCoursesQueryOptions>;
};

export const useLabCourses = ({ params, queryConfig }: UseLabCoursesOptions = {}) => {
  return useQuery({
    ...getAllLabCoursesQueryOptions(params),
    ...queryConfig,
  });
};

type UseLabCourseByIdOptions = {
  queryConfig?: QueryConfig<typeof getLabCourseByIdQueryOptions>;
};

export const useLabCourseById = (id: number, { queryConfig }: UseLabCourseByIdOptions = {}) => {
  return useQuery({
    ...getLabCourseByIdQueryOptions(id),
    ...queryConfig,
  });
};

// Mutations
export const useCreateLabCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLabCourseRequest) => labCourseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-courses"] });
    },
  });
};

export const useUpdateLabCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLabCourseRequest) => labCourseService.update(data),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: ["lab-courses"] });
      queryClient.invalidateQueries({ queryKey: ["lab-courses", updatedCourse.id] });
    },
  });
};

export const useDeleteLabCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => labCourseService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-courses"] });
    },
  });
};
