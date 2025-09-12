import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import professorService from "@/services/professor";

export const getAllProfessorsQueryOptions = () => {
  return queryOptions({
    queryKey: ["professors"],
    queryFn: () => professorService.findAll(),
  });
};

type UseProfessorsOptions = {
  queryConfig?: QueryConfig<typeof getAllProfessorsQueryOptions>;
};

export const useProfessors = ({ queryConfig }: UseProfessorsOptions = {}) => {
  return useQuery({
    ...getAllProfessorsQueryOptions(),
    ...queryConfig,
  });
};
