import type { JSONSchemaProperty } from "./jsonSchemaProperty.ts";

type FieldSchema = {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required: string[];
};

type UISchemaElementType =
  | "Control"
  | "Button"
  | "VerticalLayout"
  | "HorizontalLayout";

type UISchemaElement = {
  type: UISchemaElementType;
  scope?: string;
  label?: string;
  options?: Record<string, unknown>;
  elements?: UISchemaElement[];
};

type UISchema = {
  type: UISchemaElementType;
  elements: UISchemaElement[];
};

type PayloadField = {
  type: "form_field" | "static";
  value: string;
};

type DynamicFieldConfig = {
  selector_field: string;
  payload_fields: Record<string, PayloadField>;
  endpoint_id: string;
};

export type Form = {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: FieldSchema;
  ui_schema: UISchema;
  dynamic_field_config: Record<string, DynamicFieldConfig>;
};
