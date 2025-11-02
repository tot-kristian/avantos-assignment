import type { JSONSchemaType } from "@/features/BlueprintGraph/api/types";

export type FieldKind = JSONSchemaType;
export type FieldFormat = "email" | "date" | "uri" | undefined;

export type TargetField = {
  name: string;
  label: string;
  format?: FieldFormat;
  valueType: FieldKind;
};
