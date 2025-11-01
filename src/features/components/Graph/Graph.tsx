import { useBlueprintGraphQuery } from "@/features/hooks/queries/useBlueprintGraphQuery.ts";
import { Node } from "@/features/components/Node/Node.tsx";
import { useState } from "react";
import { PrefillSheet } from "@/features/components/PrefillSheet/PrefillSheet.tsx";
import type { GraphNode } from "@/lib/types.ts";

export const Graph = () => {
  const { data, isPending } = useBlueprintGraphQuery({
    tenantId: "1",
    blueprintId: "1",
  });

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  if (isPending) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;
  const onPrefillSheetClose = () => {
    setSelectedNode(null);
  };

  console.log(data);

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
      <PrefillSheet
        graph={data}
        node={selectedNode}
        onClose={onPrefillSheetClose}
      />
    </>
  );
};
