import { useBlueprintGraphQuery } from "@/hooks/useBlueprintGraphQuery.ts";
import { Node } from "@/components/Node/Node.tsx";
import { useState } from "react";
import { PrefillSheet } from "@/components/PrefillSheet/PrefillSheet.tsx";
import type { GraphNode } from "@/lib/types.ts";

export const Graph = () => {
  const { data, isPending } = useBlueprintGraphQuery({
    tenantId: "1",
    blueprintId: "1",
  });

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  if (isPending) return <div>Loading...</div>;

  const onPrefillSheetClose = () => {
    setSelectedNode(null);
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        {data?.nodes.map((node) => {
          return (
            <Node
              key={node.id}
              title={node.data.name}
              label="Form"
              nodeClick={() => setSelectedNode(node)}
            />
          );
        })}
      </div>
      <PrefillSheet data={selectedNode} onClose={onPrefillSheetClose} />
    </>
  );
};
