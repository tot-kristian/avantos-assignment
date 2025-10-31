import { apiClient } from "@/api/client.ts";
import type { ActionBlueprintGraphResponse } from "@/lib/types.ts";

export type FetchFormsParams = { tenantId: string; blueprintId: string };

export const getBlueprintsGraphData = async ({
  tenantId,
  blueprintId,
}: FetchFormsParams):Promise<ActionBlueprintGraphResponse> => {
  const response = await apiClient.get<ActionBlueprintGraphResponse>(
    `${tenantId}/actions/blueprints/${blueprintId}/graph`,
  );

  return response.data;
};
