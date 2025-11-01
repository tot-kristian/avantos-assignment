import type { ActionBlueprintGraphResponse, GraphNode } from "@/lib/types.ts";
import { Drawer } from "@/components/Drawer/Drawer.tsx";
import { PrefillSheetContent } from "@/features/components/PrefillSheet/PrefillSheetContent.tsx";

type PrefillSheetProps = {
  graph: ActionBlueprintGraphResponse;
  node: GraphNode | null;
  onClose: () => void;
};

export const PrefillSheet = ({ node, onClose, graph }: PrefillSheetProps) => {
  return (
    <Drawer
      open={!!node}
      onClose={onClose}
      title="Prefill Form"
      description="Configure the form prefill settings"
    >
      <div className="grid gap-3">
        {node && (
          <>
            <p>Node ID: {node.id}</p>
            <p>Name: {node.data.name}</p>
            <PrefillSheetContent graph={graph} node={node} />
          </>
        )}
      </div>
    </Drawer>
  );
};
