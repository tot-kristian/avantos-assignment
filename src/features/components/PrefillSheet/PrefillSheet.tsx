import { Drawer } from "@/components/Drawer/Drawer.tsx";
import { PrefillSheetContent } from "@/features/components/PrefillSheet/PrefillSheetContent.tsx";
import { useGraph } from "@/features/hooks/useGraph.ts";

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
      <div className="grid gap-3">
        {selectedNode && (
          <>
            <p>Node ID: {selectedNode.id}</p>
            <p>Name: {selectedNode.data.name}</p>
            <PrefillSheetContent />
          </>
        )}
      </div>
    </Drawer>
  );
};
