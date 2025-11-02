import { Node } from "@/features/BlueprintGraph/components/Node/Node.tsx";
import type { GraphNode } from "@/features/BlueprintGraph/api/types";

type Props = {
  nodes: GraphNode[];
  setSelectedNode: (node: GraphNode | null) => void;
};
export const GraphCanvas = ({ nodes, setSelectedNode }: Props) => {
  return nodes.map((node) => {
    return (
      <Node
        key={node.id}
        title={node.data.name}
        label="Form"
        nodeClick={() => setSelectedNode(node)}
      />
    );
  });
};
