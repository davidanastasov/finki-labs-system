import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import studentService from "@/services/student";

export const filterStudentsQueryOptions = (params: Parameters<typeof studentService.filter>[0]) => {
  return queryOptions({
    queryKey: ["students", params],
    queryFn: () => studentService.filter(params),
    gcTime: 5 * 1000, // 5 seconds
  });
};

type UseStudentsOptions = {
  search?: string;
  studyProgramCode?: string;
  page?: number;
  pageSize?: number;
  queryConfig?: QueryConfig<typeof filterStudentsQueryOptions>;
};

export const useStudents = ({
  search,
  studyProgramCode,
  page,
  pageSize,
  queryConfig,
}: UseStudentsOptions = {}) => {
  return useQuery({
    ...filterStudentsQueryOptions({ search, studyProgramCode, page, pageSize }),
    ...queryConfig,
  });
};
