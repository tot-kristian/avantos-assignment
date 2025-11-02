import type {
  ActionBlueprintGraphResponse,
  ApiMappingEntry,
  Form,
  GraphNode,
  JSONSchemaProperty,
} from "@/features/BlueprintGraph/api/types";
import type { GraphEdge } from "@/features/BlueprintGraph/api/types/graphEdge.ts";

export const createMockNode = (
  id: string,
  name: string,
  inputMapping: Record<string, ApiMappingEntry> = {},
): GraphNode => ({
  id,
  type: "action",
  position: { x: 0, y: 0 },
  data: {
    id: "unique-action-id",
    component_key: `component_${id}`,
    input_mapping: inputMapping,
    component_type: "any",
    component_id: "form_id",
    name,
  },
});

export const createMockGraph = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  forms: Form[] = [],
): Pick<ActionBlueprintGraphResponse, "nodes" | "edges" | "forms"> => ({
  nodes,
  edges,
  forms,
});

export const createMockApiResponse = ({
  tenantId = "1",
  id = "1",
  name = "blueprint",
  nodes = [],
  edges = [],
  forms = [],
}: {
  tenantId?: string;
  id?: string;
  name?: string;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  forms?: Form[];
}): ActionBlueprintGraphResponse => {
  return {
    tenant_id: tenantId,
    id,
    name,
    ...createMockGraph(nodes, edges, forms),
  };
};

export const createMockForm = (
  properties: Record<string, JSONSchemaProperty>,
  id: string = "form1",
  name: string = "Test Form",
): Form => ({
  id,
  name,
  field_schema: {
    type: "object",
    required: [],
    properties,
  },
});
