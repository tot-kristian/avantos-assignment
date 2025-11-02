import { createContext } from "react";
import type {
  ActionBlueprintGraphResponse,
  ApiMappingEntry,
  GraphNode,
} from "@/features/BlueprintGraph/api/types";

type GraphContextValue = {
  graphData: ActionBlueprintGraphResponse;
  isLoading: boolean;
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;
  updateNodeMapping: (selectedField: string, entry: ApiMappingEntry) => void;
  clearNode: (selectedField: string) => void;
};

export const GraphContext = createContext<GraphContextValue | null>(null);
