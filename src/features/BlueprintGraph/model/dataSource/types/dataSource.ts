import type { ActionBlueprintGraphResponse } from "@/features/BlueprintGraph/api/types";
import type { TargetField } from "./targetField.ts";
import type { DataSourceItem } from "./dataSourceItem.ts";

export type DataSource = {
  id: string;
  label: string;
  listFor(args: {
    graph: Pick<ActionBlueprintGraphResponse, "nodes" | "edges" | "forms">;
    targetNodeId: string;
    targetField?: TargetField;
  }): DataSourceItem[];
};

export type DataSourceMap = Record<string, DataSourceItem[]>;
