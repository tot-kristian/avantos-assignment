import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Blueprint } from "@/components/Blueprint/Blueprint.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Blueprint />
    </QueryClientProvider>
  );
}

export default App;
