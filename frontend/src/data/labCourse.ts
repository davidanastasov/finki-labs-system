import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import type {
  CreateLabCourseRequest,
  UpdateLabCourseRequest,
  UpdateSignatureRequirementsRequest,
} from "@/services/lab-course/models";
import labCourseService from "@/services/lab-course";

// Query options
export const getLabCoursesFilterQueryOptions = (
  params: Parameters<typeof labCourseService.filter>[0],
) => {
  return queryOptions({
    queryKey: ["lab-courses", "filter", params],
    queryFn: () => labCourseService.filter(params),
  });
};

export const getLabCourseByIdQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["lab-courses", id],
    queryFn: () => labCourseService.findById(id),
  });
};

export const getStudentsWithSignatureQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ["lab-courses", courseId, "students-signature"],
    queryFn: () => labCourseService.getStudentsWithSignatureStatus(courseId),
  });

export const useStudentsWithSignature = (courseId: number) => {
  return useQuery(getStudentsWithSignatureQueryOptions(courseId));
};

// Hooks
type UseLabCoursesFilterOptions = {
  params: {
    search?: string;
    semesterCode?: string;
    page?: number;
    pageSize?: number;
  };
  queryConfig?: QueryConfig<typeof getLabCoursesFilterQueryOptions>;
};

export const useLabCoursesFilter = ({ params, queryConfig }: UseLabCoursesFilterOptions) => {
  return useQuery({
    ...getLabCoursesFilterQueryOptions(params),
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

export const useUpdateSignatureRequirements = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSignatureRequirementsRequest) =>
      labCourseService.updateSignatureRequirements(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-courses", courseId] });
      queryClient.invalidateQueries({ queryKey: ["lab-courses", courseId, "students-signature"] });
    },
  });
};
