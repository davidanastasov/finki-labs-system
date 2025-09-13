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
export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExerciseRequest) => exerciseService.create(data),
    onSuccess: (newExercise) => {
      queryClient.invalidateQueries({
        queryKey: ["exercises", "lab-course", newExercise.labCourseId],
      });
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateExerciseRequest) => exerciseService.update(data),
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
