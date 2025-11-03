import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout/Layout.tsx";
import { BlueprintGraph } from "@/features/BlueprintGraph/components/BlueprintGraph/BlueprintGraph.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <BlueprintGraph />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
