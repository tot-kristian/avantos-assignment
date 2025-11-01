import type {
  ActionBlueprintGraphResponse,
  Form,
  GraphNode,
  JSONSchemaProperty,
} from "@/lib/types.ts";

export const getFormForNode = (
  graph: ActionBlueprintGraphResponse,
  nodeId?: string,
): Form | undefined => {
  if (!nodeId) return;

  return graph.forms.find((f) => f.id === nodeId);
};

export const getFormFieldsWithPrefill = (
  node: GraphNode,
  form: Form,
): { key: string; value: JSONSchemaProperty; hasMapper: boolean }[] => {
  return Object.entries(form.field_schema.properties).map(([key, value]) => {
    const hasMapper = !!node?.data.input_mapping?.[key];

    return {
      key,
      value,
      hasMapper,
    };
  });
};
