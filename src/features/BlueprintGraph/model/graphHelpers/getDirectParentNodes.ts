import type {
  ActionBlueprintGraphResponse,
  GraphNode,
} from "@/features/BlueprintGraph/api/types";

export const getDirectParentNodes = (
  graph: Pick<ActionBlueprintGraphResponse, "nodes" | "edges">,
  nodeId: string,
): GraphNode[] => {
  const parentNodes = graph.edges.filter((edge) => edge.target === nodeId);

  if (!parentNodes.length) return [];
  return graph.nodes.filter(
    (n) => n.id === parentNodes.find((p) => p.source === n.id)?.source,
  );
};