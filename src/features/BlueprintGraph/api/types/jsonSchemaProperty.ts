import type { FieldFormat } from "@/features/BlueprintGraph/model/dataSource/types";

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
  format?: FieldFormat;
  enum?: unknown[] | null;
  items?: {
    enum?: string[];
    type?: string;
  };
  uniqueItems?: boolean;
};
