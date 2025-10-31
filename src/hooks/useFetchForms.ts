import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchForms, type FetchFormsParams } from "@/api/fetchForms.ts";

type FunctionData = Awaited<ReturnType<typeof fetchForms>>;
const FETCH_FORMS_KEY = ["forms"];

export const useFetchForms = <TData = FunctionData>(
  apiParams: FetchFormsParams,
  options: Omit<
    UseQueryOptions<FunctionData, Error, TData>,
    "queryFn" | "queryKey"
  > = {},
) => {
  return useQuery({
    staleTime: Infinity,
    ...options,
    queryKey: FETCH_FORMS_KEY,
    queryFn: () => fetchForms(apiParams),
  });
};
