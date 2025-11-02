import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Graph } from "@/features/BlueprintGraph/components/Graph/Graph.tsx";
import { Layout } from "@/components/Layout/Layout.tsx";
import { GraphProvider } from "@/features/BlueprintGraph/context/GraphProvider.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        {/* NOTE: In a real-world scenario, `tenantId` and `blueprintId` would be
          passed as query parameters or derived dynamically (e.g., from the route or user context).
          Since the API always returns the same static data for this assignment,
          these values are hardcoded here for simplicity and clarity. */}
        <GraphProvider tenantId="1" blueprintId="2">
          <Graph />
        </GraphProvider>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
