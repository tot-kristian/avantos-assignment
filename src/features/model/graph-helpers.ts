import type {
  ActionBlueprintGraphResponse,
  Form,
  GraphNode,
  JSONSchemaProperty,
} from "@/lib/types.ts";
import type {
  FieldFormat,
  FieldKind,
  TargetField,
} from "@/features/model/types.ts";

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

const mapPropertyType = (
  prop: JSONSchemaProperty,
): {
  valueType: FieldKind;
  format?: FieldFormat;
} => {
  const t = prop?.type;
  if (t === "array") return { valueType: "array" };
  if (t === "object") return { valueType: "object" };

  const format = prop?.format === "email" ? "email" : undefined;
  return { valueType: "string", format };
};

export const getFormFields = (form: Form): TargetField[] => {
  const props = form?.field_schema?.properties ?? {};
  return Object.entries(props).map(([name, prop]) => {
    const { valueType, format } = mapPropertyType(prop);
    return {
      name,
      label: name,
      valueType,
      format,
    };
  });
};

export const getDirectParentNodes = (
  graph: ActionBlueprintGraphResponse,
  nodeId: string,
): GraphNode[] => {
  const parentNodes = graph.edges.filter((edge) => edge.target === nodeId);

  if (!parentNodes.length) return [];
  return graph.nodes.filter(
    (n) => n.id === parentNodes.find((p) => p.source === n.id)?.source,
  );
};
