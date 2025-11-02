import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  type FetchFormsParams,
  getBlueprintsGraphData,
} from "@/features/BlueprintGraph/api/getBlueprintsGraphData.ts";

type FunctionData = Awaited<ReturnType<typeof getBlueprintsGraphData>>;
export const getFetchBlueprintGraphKeys = (params: FetchFormsParams) => [
  "blueprint-graph",
  params.tenantId,
  params.blueprintId,
];

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
    queryKey: getFetchBlueprintGraphKeys(apiParams),
    queryFn: () => getBlueprintsGraphData(apiParams),
  });
};
