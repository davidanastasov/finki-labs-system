import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/integrations/tanstack-query/types";
import studentService from "@/services/student";

export const getAllStudentsQueryOptions = (
  search?: string,
  studyProgramCode?: string,
  pageNum?: number,
  pageSize?: number,
) => {
  return queryOptions({
    queryKey: ["students"],
    queryFn: () => studentService.filter(search, studyProgramCode, pageNum, pageSize),
  });
};

type UseStudentsOptions = {
  search?: string;
  studyProgramCode?: string;
  pageNum?: number;
  pageSize?: number;
  queryConfig?: QueryConfig<typeof getAllStudentsQueryOptions>;
};

export const useStudents = ({
  search,
  studyProgramCode,
  pageNum,
  pageSize,
  queryConfig,
}: UseStudentsOptions = {}) => {
  return useQuery({
    ...getAllStudentsQueryOptions(search, studyProgramCode, pageNum, pageSize),
    ...queryConfig,
  });
};
