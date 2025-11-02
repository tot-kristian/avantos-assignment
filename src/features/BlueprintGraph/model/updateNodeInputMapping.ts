import type {
  ActionBlueprintGraphResponse,
  ApiMappingEntry,
} from "@/features/BlueprintGraph/api/types";

export const updateNodeInputMapping = ({
  graphData,
  nodeId,
  selectedField,
  entry,
}: {
  graphData: ActionBlueprintGraphResponse;
  nodeId: string;
  selectedField: string;
  entry?: ApiMappingEntry | null;
}): ActionBlueprintGraphResponse => {
  const next = structuredClone(graphData);
  const node = next.nodes.find((n) => n.id === nodeId);

  if (!node) return graphData;

  node.data.input_mapping ??= {};

  if (!entry) {
    delete node.data.input_mapping[selectedField];
  } else {
    node.data.input_mapping[selectedField] = entry;
  }

  return next;
};
