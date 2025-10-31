import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Graph } from "@/components/Graph/Graph.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Graph />
    </QueryClientProvider>
  );
}

export default App;
