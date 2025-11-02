import type {
  ActionBlueprintGraphResponse,
  GraphNode,
} from "@/features/BlueprintGraph/api/types";
import { getDirectParentNodes } from "@/features/BlueprintGraph/model/graphHelpers/getDirectParentNodes.ts";

const getAllParentNodes = (
  graph: Pick<ActionBlueprintGraphResponse, "nodes" | "edges">,
  nodeId: string,
  visited = new Set<string>(),
): GraphNode[] => {
  const parents = getDirectParentNodes(graph, nodeId);
  for (const parent of parents) {
    if (!visited.has(parent.id)) {
      visited.add(parent.id);
      getAllParentNodes(graph, parent.id, visited);
    }
  }

  return Array.from(visited).map((id) => graph.nodes.find((n) => n.id === id)!);
};

export const getTransitiveParentNodes = (
  graph: Pick<ActionBlueprintGraphResponse, "nodes" | "edges">,
  nodeId: string,
): GraphNode[] => {
  const directParents = new Set(
    getDirectParentNodes(graph, nodeId).map((p) => p.id),
  );
  const allParents = getAllParentNodes(graph, nodeId);

  return allParents.filter((node) => !directParents.has(node.id));
};
