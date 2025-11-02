import { GlobalSource } from "@/features/BlueprintGraph/model/dataSource/global.ts";
import { DirectParentDataSource } from "@/features/BlueprintGraph/model/dataSource/directParent.ts";
import { TransitiveParentDataSource } from "@/features/BlueprintGraph/model/dataSource/transitiveParent.ts";
import type { DataSourceMap } from "./types";
import type { ActionBlueprintGraphResponse } from "@/features/BlueprintGraph/api/types";

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
