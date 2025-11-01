import type {
  ActionBlueprintGraphResponse,
  JSONSchemaType,
} from "@/lib/types.ts";

export type ApiMappingEntry = {
  type: string;
  component_key: string;
  output_key: string;
  is_metadata: boolean;
};

export type FieldKind = JSONSchemaType;
export type FieldFormat = "email" | "date" | "uri" | undefined;

export type TargetField = {
  name: string;
  label: string;
  format?: FieldFormat;
  valueType: FieldKind;
};

export type DataSourceItem = {
  id: string;
  group: string;
  label: string;
  valueType: FieldKind;
  format?: FieldFormat;
  entry: ApiMappingEntry;
};

export interface DataSource {
  id: string;
  label: string;
  listFor(args: {
    graph: ActionBlueprintGraphResponse;
    targetNodeId: string;
    targetField?: TargetField;
  }): DataSourceItem[];
}
