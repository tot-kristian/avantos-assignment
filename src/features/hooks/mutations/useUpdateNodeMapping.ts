import { useQueryClient } from "@tanstack/react-query";
import { getFetchBlueprintGraphKeys } from "@/features/hooks/queries/useBlueprintGraphQuery.ts";
import type { ApiMappingEntry } from "@/features/model/types.ts";
import type { ActionBlueprintGraphResponse } from "@/lib/types.ts";

export const useUpdateNodeMapping = (tenantId: string, blueprintId: string) => {
  const qc = useQueryClient();
  const setField = ({
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

  const key = getFetchBlueprintGraphKeys({ tenantId, blueprintId });

  return { setField };
};
