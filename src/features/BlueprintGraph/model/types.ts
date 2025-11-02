import type {
  ActionBlueprintGraphResponse,
  ApiMappingEntry,
  JSONSchemaType,
} from "@/features/BlueprintGraph/api/types";

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

export type DataSource = {
  id: string;
  label: string;
  listFor(args: {
    graph: ActionBlueprintGraphResponse;
    targetNodeId: string;
    targetField?: TargetField;
  }): DataSourceItem[];
};

export type DataSourceMap = Record<string, DataSourceItem[]>;

export type DataSourceItemWithGroup = { group: string; item: DataSourceItem };
