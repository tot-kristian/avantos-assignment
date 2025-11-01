import { GlobalSource } from "@/features/data-source/global.ts";
import { DirectParentDataSource } from "@/features/data-source/direct-parent.ts";
import { TransitiveParentDataSource } from "@/features/data-source/transitive-parent.ts";
import type { DataSourceItem } from "@/features/model/types.ts";
import type { ActionBlueprintGraphResponse, GraphNode } from "@/lib/types.ts";

const dataSources = [
  GlobalSource,
  DirectParentDataSource,
  TransitiveParentDataSource,
] as const;

export const getAllDataSources = (
  graph: ActionBlueprintGraphResponse,
  node: GraphNode,
): Record<string, DataSourceItem[]> => {
  return dataSources
    .flatMap((ds) => ds.listFor({ graph, targetNodeId: node.id }))
    .reduce<Record<string, DataSourceItem[]>>((acc, curr) => {
      if (acc[curr.group]) {
        acc[curr.group].push(curr);
      } else {
        acc[curr.group] = [curr];
      }
      return acc;
    }, {});
};
