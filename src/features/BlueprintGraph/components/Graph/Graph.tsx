import { PrefillSheet } from "@/features/BlueprintGraph/components/PrefillSheet/PrefillSheet.tsx";
import { GraphCanvas } from "@/features/BlueprintGraph/components/Graph/GraphCanvas/GraphCanvas.tsx";
import { useGraph } from "@/features/BlueprintGraph/hooks/useGraph.ts";

export const Graph = () => {
  const { graphData, isLoading, setSelectedNode } = useGraph();

  if (isLoading) return <div data-testid="graph-loading">Loading...</div>;
  if (!graphData)
    return <div data-testid="graph-no-data">No data available</div>;

  return (
    <>
      <div className="flex flex-col gap-4" data-testid="graph-canvas">
        <GraphCanvas
          nodes={graphData.nodes}
          setSelectedNode={setSelectedNode}
        />
      </div>
      <PrefillSheet />
    </>
  );
};
