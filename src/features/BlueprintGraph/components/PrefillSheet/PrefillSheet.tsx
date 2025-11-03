import { Drawer } from "@/components/Drawer/Drawer.tsx";
import { PrefillSheetContent } from "@/features/BlueprintGraph/components/PrefillSheet/PrefillSheetContent/PrefillSheetContent.tsx";
import { useGraph } from "@/features/BlueprintGraph/hooks/useGraph.ts";

export const PrefillSheet = () => {
  const { selectedNode, setSelectedNode } = useGraph();

  const onPrefillSheetClose = () => {
    setSelectedNode(null);
  };

  return (
    <Drawer
      open={!!selectedNode}
      onClose={() => onPrefillSheetClose()}
      title="Prefill Form"
      description="Configure the form prefill settings"
    >
      <div className="grid gap-3" data-testid="prefill-sheet">
        {selectedNode && (
          <>
            <p data-testId="prefill-sheet-node-id">
              Node ID: {selectedNode.id}
            </p>
            <p data-testId="prefill-sheet-name">
              Name: {selectedNode.data.name}
            </p>
            <PrefillSheetContent />
          </>
        )}
      </div>
    </Drawer>
  );
};
