import type { GraphNode } from "./graphNode.ts";
import type { Form } from "./form.ts";
import type { GraphEdge } from "@/features/BlueprintGraph/api/types/graphEdge.ts";

export type ActionBlueprintGraphResponse = {
  id: string;
  tenant_id: string;
  name: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: Form[];
};
