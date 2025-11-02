import type { ApiMappingEntry } from "@/features/BlueprintGraph/api/types";
import type { FieldFormat, FieldKind } from "./targetField.ts";

export type DataSourceItem = {
  id: string;
  group: string;
  label: string;
  valueType: FieldKind;
  format?: FieldFormat;
  entry: ApiMappingEntry;
};

export type DataSourceItemWithGroup = { group: string; item: DataSourceItem };
