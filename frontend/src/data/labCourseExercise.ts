import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import type { CreateExerciseRequest, UpdateExerciseRequest } from "@/services/exercise/models";
import exerciseService from "@/services/exercise";

// Query options
export const getExercisesByLabCourseIdQueryOptions = (courseId: number) => {
  return queryOptions({
    queryKey: ["lab-courses", courseId, "exercises"],
    queryFn: () => exerciseService.findByLabCourseId(courseId),
  });
};

export const getExerciseByIdQueryOptions = (courseId: number, id: number) => {
  return queryOptions({
    queryKey: ["lab-courses", courseId, "exercises", id],
    queryFn: () => exerciseService.findById(id),
  });
};

// Hooks
type UseExercisesByLabCourseIdOptions = {
  queryConfig?: QueryConfig<typeof getExercisesByLabCourseIdQueryOptions>;
};

export const useExercisesByLabCourseId = (
  labCourseId: number,
  { queryConfig }: UseExercisesByLabCourseIdOptions = {},
) => {
  return useQuery({
    ...getExercisesByLabCourseIdQueryOptions(labCourseId),
    ...queryConfig,
  });
};

type UseExerciseByIdOptions = {
  courseId: number;
  queryConfig?: QueryConfig<typeof getExerciseByIdQueryOptions>;
};

export const useExerciseById = (id: number, { courseId, queryConfig }: UseExerciseByIdOptions) => {
  return useQuery({
    ...getExerciseByIdQueryOptions(courseId, id),
    ...queryConfig,
  });
};

// Mutations
type CreateExerciseWithFilesData = {
  data: CreateExerciseRequest;
  files?: File[];
};

export const useCreateExercise = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files }: CreateExerciseWithFilesData) =>
      exerciseService.create(courseId, data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-courses", courseId, "exercises"] });
    },
  });
};

type UpdateExerciseWithFilesData = {
  data: UpdateExerciseRequest;
  files?: File[];
  removeFiles?: string[];
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files, removeFiles }: UpdateExerciseWithFilesData) =>
      exerciseService.update(data, files, removeFiles),
    onSuccess: (updatedExercise) => {
      queryClient.invalidateQueries({
        queryKey: ["lab-courses", updatedExercise.course.id, "exercises"],
      });
    },
  });
};

export const useDeleteExercise = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => exerciseService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-courses", courseId, "exercises"] });
    },
  });
};
