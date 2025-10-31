import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  type FetchFormsParams,
  getBlueprintsGraphData,
} from "@/api/getBlueprintsGraphData.ts";

type FunctionData = Awaited<ReturnType<typeof getBlueprintsGraphData>>;
const FETCH_FORMS_KEY = ["forms"];

export const useBlueprintGraphQuery = <TData = FunctionData>(
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
    queryFn: () => getBlueprintsGraphData(apiParams),
  });
};
