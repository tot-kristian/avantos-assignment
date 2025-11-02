import type {
  ActionBlueprintGraphResponse,
  Form,
} from "@/features/BlueprintGraph/api/types";

export const getFormForNode = (
  graph: Pick<ActionBlueprintGraphResponse, "forms">,
  nodeId?: string,
): Form | undefined => {
  if (!nodeId) return;

  return graph.forms.find((f) => f.id === nodeId);
};
