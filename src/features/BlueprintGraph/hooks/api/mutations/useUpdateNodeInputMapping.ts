import { useQueryClient } from "@tanstack/react-query";
import { getFetchBlueprintGraphKeys } from "@/features/BlueprintGraph/hooks/api/queries/useBlueprintGraphQuery.ts";
import type {
  ActionBlueprintGraphResponse,
  ApiMappingEntry,
} from "@/features/BlueprintGraph/api/types";
import { updateNodeInputMapping } from "@/features/BlueprintGraph/model/updateNodeInputMapping.ts";

export const useUpdateNodeInputMapping = (params: {
  tenantId: string;
  blueprintId: string;
}) => {
  const qc = useQueryClient();

  const updateNode = ({
    nodeId,
    selectedField,
    entry,
  }: {
    nodeId: string;
    selectedField: string;
    entry?: ApiMappingEntry | null;
  }) => {
    qc.setQueryData(key, (prevGraph: ActionBlueprintGraphResponse) => {
      if (!prevGraph) return prevGraph;
      return updateNodeInputMapping({
        graphData: prevGraph,
        nodeId,
        selectedField,
        entry,
      });
    });
  };

  const key = getFetchBlueprintGraphKeys(params);

  return { updateNode };
};
