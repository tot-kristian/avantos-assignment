import { createContext } from "react";
import type { ActionBlueprintGraphResponse, GraphNode } from "@/lib/types.ts";
import type { ApiMappingEntry } from "@/features/model/types.ts";

type GraphContextValue = {
  graphData: ActionBlueprintGraphResponse;
  isLoading: boolean;
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;
  updateNodeMapping: (selectedField: string, entry: ApiMappingEntry) => void;
  clearNode: (selectedField: string) => void;
};

export const GraphContext = createContext<GraphContextValue | null>(null);
