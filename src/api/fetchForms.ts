import { apiClient } from "@/api/client.ts";

export type FetchFormsParams = { tenantId: string; blueprintId: string };

export const fetchForms = async ({
  tenantId,
  blueprintId,
}: FetchFormsParams) => {
  const response = await apiClient.get(
    `${tenantId}/actions/blueprints/${blueprintId}/graph`,
  );

  return response.data;
};
