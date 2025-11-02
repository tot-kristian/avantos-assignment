import { useQueryClient } from "@tanstack/react-query";
import { getFetchBlueprintGraphKeys } from "@/features/BlueprintGraph/hooks/api/queries/useBlueprintGraphQuery.ts";
import type {
  ActionBlueprintGraphResponse,
  ApiMappingEntry,
} from "@/features/BlueprintGraph/api/types";

export const useUpdateNodeMapping = (params: {
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
    qc.setQueryData(key, (prev: ActionBlueprintGraphResponse) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      const node = next.nodes.find((n) => n.id === nodeId);
      if (!node) return prev;

      node.data.input_mapping ??= {};
      if (!entry) delete node.data.input_mapping[selectedField];
      else node.data.input_mapping[selectedField] = entry;

      return next;
    });
  };

  const key = getFetchBlueprintGraphKeys(params);

  return { updateNode };
};
