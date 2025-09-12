import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import semesterService from "@/services/semester";
import { STATIC_DATA_STALE_TIME } from "@/lib/constants";

export const getAllSemestersQueryOptions = () => {
  return queryOptions({
    queryKey: ["semesters"],
    queryFn: () => semesterService.findAll(),
    staleTime: STATIC_DATA_STALE_TIME,
  });
};

type UseSemestersOptions = {
  queryConfig?: QueryConfig<typeof getAllSemestersQueryOptions>;
};

export const useSemesters = ({ queryConfig }: UseSemestersOptions = {}) => {
  return useQuery({
    ...getAllSemestersQueryOptions(),
    ...queryConfig,
  });
};
