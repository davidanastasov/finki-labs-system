import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import studyProgramService from "@/services/study-program";

export const getAllStudyProgramsQueryOptions = () => {
  return queryOptions({
    queryKey: ["study-programs"],
    queryFn: () => studyProgramService.findAll(),
  });
};

type UseStudyProgramsOptions = {
  queryConfig?: QueryConfig<typeof getAllStudyProgramsQueryOptions>;
};

export const useStudyPrograms = ({ queryConfig }: UseStudyProgramsOptions = {}) => {
  return useQuery({
    ...getAllStudyProgramsQueryOptions(),
    ...queryConfig,
  });
};
