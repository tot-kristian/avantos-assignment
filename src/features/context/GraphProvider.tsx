import { type ReactNode, useState } from "react";
import { useBlueprintGraphQuery } from "@/features/hooks/api/queries/useBlueprintGraphQuery.ts";
import { GraphContext } from "@/features/context/GraphContext.tsx";
import type { GraphNode } from "@/lib/types.ts";
import { useUpdateNodeMapping } from "@/features/hooks/api/mutations/useUpdateNodeMapping.ts";
import type { ApiMappingEntry } from "@/features/model/types.ts";

interface GraphProviderProps {
  tenantId: string;
  blueprintId: string;
  children: ReactNode;
}

export const GraphProvider = ({
  tenantId,
  blueprintId,
  children,
}: GraphProviderProps) => {
  const { data, isPending } = useBlueprintGraphQuery({
    tenantId,
    blueprintId,
  });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const { setField } = useUpdateNodeMapping({ tenantId, blueprintId });

  const clearNode = (fieldToBeRemoved: string) => {
    if (!selectedNode) return;

    setField({ nodeId: selectedNode.id, selectedField: fieldToBeRemoved });
  };

  const updateNodeMapping = (field: string, entry: ApiMappingEntry) => {
    if (!selectedNode) return;

    setField({ nodeId: selectedNode?.id, selectedField: field, entry });
  };

  return (
    <GraphContext.Provider
      value={{
        graphData: data!,
        selectedNode,
        setSelectedNode,
        isLoading: isPending,
        updateNodeMapping,
        clearNode,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
