import { GraphProvider } from "@/features/BlueprintGraph/context/GraphProvider.tsx";
import { Graph } from "@/features/BlueprintGraph/components/Graph/Graph.tsx";

export const BlueprintGraph = () => {
  /* NOTE: In a real-world scenario, `tenantId` and `blueprintId` would be
     passed as query parameters or derived dynamically (e.g., from the route or user context).
     Since the API always returns the same static data for this assignment,
     these values are hardcoded here for simplicity and clarity. */
  return (
    <GraphProvider tenantId="1" blueprintId="2">
      <Graph />
    </GraphProvider>
  );
};
