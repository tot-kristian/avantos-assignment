import { type ReactNode, useEffect, useState } from "react";
import { useBlueprintGraphQuery } from "@/features/BlueprintGraph/hooks/api/queries/useBlueprintGraphQuery.ts";
import { GraphContext } from "@/features/BlueprintGraph/context/GraphContext.tsx";
import type {
  ApiMappingEntry,
  GraphNode,
} from "@/features/BlueprintGraph/api/types";
import { useUpdateNodeMapping } from "@/features/BlueprintGraph/hooks/api/mutations/useUpdateNodeMapping.ts";

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
  console.log(data);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const { updateNode } = useUpdateNodeMapping({ tenantId, blueprintId });

  useEffect(() => {
    if (!data || !selectedNode) return;

    const node = data.nodes.find((n) => n.id === selectedNode.id);
    if (!node) return;
    setSelectedNode(node);
  }, [data, selectedNode]);

  const clearNode = (fieldToBeRemoved: string) => {
    if (!selectedNode) return;

    updateNode({ nodeId: selectedNode.id, selectedField: fieldToBeRemoved });
  };

  const updateNodeMapping = (field: string, entry: ApiMappingEntry) => {
    if (!selectedNode) return;

    updateNode({ nodeId: selectedNode?.id, selectedField: field, entry });
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
