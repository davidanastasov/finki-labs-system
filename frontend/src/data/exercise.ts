import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import type { CreateExerciseRequest, UpdateExerciseRequest } from "@/services/exercise/models";
import exerciseService from "@/services/exercise";

// Query options
export const getExercisesByLabCourseIdQueryOptions = (labCourseId: number) => {
  return queryOptions({
    queryKey: ["exercises", "lab-course", labCourseId],
    queryFn: () => exerciseService.findByLabCourseId(labCourseId),
  });
};

export const getExerciseByIdQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ["exercises", id],
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
  queryConfig?: QueryConfig<typeof getExerciseByIdQueryOptions>;
};

export const useExerciseById = (id: number, { queryConfig }: UseExerciseByIdOptions = {}) => {
  return useQuery({
    ...getExerciseByIdQueryOptions(id),
    ...queryConfig,
  });
};

// Mutations
type CreateExerciseWithFilesData = {
  data: CreateExerciseRequest;
  files?: File[];
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files }: CreateExerciseWithFilesData) =>
      exerciseService.create(data, files),
    onSuccess: (newExercise) => {
      queryClient.invalidateQueries({
        queryKey: ["exercises", "lab-course", newExercise.labCourseId],
      });
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
        queryKey: ["exercises", "lab-course", updatedExercise.labCourseId],
      });
      queryClient.invalidateQueries({ queryKey: ["exercises", updatedExercise.id] });
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => exerciseService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
};
