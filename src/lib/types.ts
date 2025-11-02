import type { ApiMappingEntry } from "@/features/model/types.ts";

type Position = {
  x: number;
  y: number;
};

type SLADuration = {
  number: number;
  unit: "minutes" | "hours" | "days";
};

type NodeData = {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: Record<string, ApiMappingEntry>;
  sla_duration: SLADuration;
  approval_required: boolean;
  approval_roles: string[];
};

export type GraphNode = {
  id: string;
  type: string;
  position: Position;
  data: NodeData;
};

type GraphEdge = {
  source: string;
  target: string;
};

type AvantosType =
  | "button"
  | "checkbox-group"
  | "object-enum"
  | "short-text"
  | "multi-select"
  | "multi-line-text";

export type JSONSchemaType = "string" | "object" | "array";

export type JSONSchemaProperty = {
  avantos_type: AvantosType;
  title?: string;
  type: JSONSchemaType;
  format?: string;
  enum?: unknown[] | null;
  items?: {
    enum?: string[];
    type?: string;
  };
  uniqueItems?: boolean;
};

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
