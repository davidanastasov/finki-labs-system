import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import subjectService from "@/services/subject";
import { STATIC_DATA_STALE_TIME } from "@/lib/constants";

export const getAllSubjectsQueryOptions = () => {
  return queryOptions({
    queryKey: ["subjects"],
    queryFn: () => subjectService.findAll(),
    staleTime: STATIC_DATA_STALE_TIME,
    gcTime: STATIC_DATA_STALE_TIME,
  });
};

type UseSubjectsOptions = {
  queryConfig?: QueryConfig<typeof getAllSubjectsQueryOptions>;
};

export const useSubjects = ({ queryConfig }: UseSubjectsOptions = {}) => {
  return useQuery({
    ...getAllSubjectsQueryOptions(),
    ...queryConfig,
  });
};
