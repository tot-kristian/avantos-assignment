import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Graph } from "@/features/components/Graph/Graph.tsx";
import { Layout } from "@/components/Layout/Layout.tsx";
import { GraphProvider } from "@/features/context/GraphProvider.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <GraphProvider tenantId="1" blueprintId="2">
          <Graph />
        </GraphProvider>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
