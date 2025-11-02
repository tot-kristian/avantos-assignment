import type { GraphNode } from "./graphNode.ts";
import type { Form } from "./form.ts";

type GraphEdge = {
  source: string;
  target: string;
};

export type ActionBlueprintGraphResponse = {
  $schema: string;
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: Form[];
  branches: unknown[];
  triggers: unknown[];
};
