import { GlobalSource } from "@/features/data-source/global.ts";
import { DirectParentDataSource } from "@/features/data-source/direct-parent.ts";
import { TransitiveParentDataSource } from "@/features/data-source/transitive-parent.ts";
import type { DataSourceMap } from "@/features/model/types.ts";
import type { ActionBlueprintGraphResponse } from "@/lib/types.ts";

const dataSources = [
  GlobalSource,
  DirectParentDataSource,
  TransitiveParentDataSource,
] as const;

export const getAllDataSources = (
  graph: ActionBlueprintGraphResponse,
  nodeId: string,
): DataSourceMap => {
  return dataSources
    .flatMap((ds) => ds.listFor({ graph, targetNodeId: nodeId }))
    .reduce<DataSourceMap>((acc, curr) => {
      if (acc[curr.group]) {
        acc[curr.group].push(curr);
      } else {
        acc[curr.group] = [curr];
      }
      return acc;
    }, {});
};
