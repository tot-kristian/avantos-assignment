import type { JSONSchemaProperty } from "./jsonSchemaProperty.ts";

type FieldSchema = {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required: string[];
};

export type Form = {
  id: string;
  name: string;
  field_schema: FieldSchema;
};
