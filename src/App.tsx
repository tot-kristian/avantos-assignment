import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Node } from "@/components/Node/Node.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Node title="Form A" label="Form" />
    </QueryClientProvider>
  );
}

export default App;
