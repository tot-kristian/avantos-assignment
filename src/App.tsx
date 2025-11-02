import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Graph } from "@/features/components/Graph/Graph.tsx";
import { Layout } from "@/components/Layout/Layout.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Graph />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
