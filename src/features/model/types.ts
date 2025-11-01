export type ApiMappingEntry = {
  type: string;
  component_key: string;
  output_key: string;
  is_metadata: boolean;
};

export type FieldKind = "text" | "array" | "object";

export type TargetField = { name: string; label: string; kind: FieldKind };

export type DataSourceItem = {
  id: string;
  group: string;
  label: FieldKind;
  entry: ApiMappingEntry;
};

export interface DataSource {
  id: string;
  label: string;
  listFor(args: {
    graph: any;
    targetNodeId: string;
    targetField?: TargetField;
  }): DataSourceItem[];
}
