import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import type {
  BulkUpdateScoresRequest,
  UpdateStudentScoreRequest,
} from "@/services/exercise/models";
import * as exerciseService from "@/services/exercise/exerciseService";

// Query options
export const getExerciseScoresQueryOptions = (exerciseId: number) => {
  return queryOptions({
    queryKey: ["exercises", exerciseId, "scores"],
    queryFn: () => exerciseService.getExerciseScores(exerciseId),
  });
};

// Hooks
type UseExerciseScoresOptions = {
  queryConfig?: QueryConfig<typeof getExerciseScoresQueryOptions>;
};

export const useExerciseScores = (
  exerciseId: number,
  { queryConfig }: UseExerciseScoresOptions = {},
) => {
  return useQuery({
    ...getExerciseScoresQueryOptions(exerciseId),
    ...queryConfig,
  });
};

// Mutations
export const useUpdateStudentScore = (exerciseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentIndex,
      data,
    }: {
      studentIndex: string;
      data: UpdateStudentScoreRequest;
    }) => exerciseService.updateStudentScore(exerciseId, studentIndex, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises", exerciseId, "scores"] });
    },
  });
};

export const useBulkUpdateScores = (exerciseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdateScoresRequest) =>
      exerciseService.bulkUpdateScores(exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises", exerciseId, "scores"] });
    },
  });
};

export const useDeleteStudentScore = (exerciseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentIndex: string) =>
      exerciseService.deleteStudentScore(exerciseId, studentIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises", exerciseId, "scores"] });
    },
  });
};
