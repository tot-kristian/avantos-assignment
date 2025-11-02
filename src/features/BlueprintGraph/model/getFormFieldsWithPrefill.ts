import type {
  Form,
  GraphNode,
  JSONSchemaProperty,
} from "@/features/BlueprintGraph/api/types";

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