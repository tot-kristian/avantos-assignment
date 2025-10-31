import type { GraphNode } from "@/lib/types.ts";
import { Drawer } from "../common/Drawer/Drawer";

type PrefillSheetProps = {
  data: GraphNode | null;
  onClose: () => void;
};

export const PrefillSheet = ({ data, onClose }: PrefillSheetProps) => {
  return (
    <Drawer
      open={!!data}
      onClose={onClose}
      title="Prefill Form"
      description="Configure the form prefill settings"
    >
      <div className="grid gap-3">
        {data && (
          <>
            <p>Node ID: {data.id}</p>
            <p>Name: {data.data.name}</p>
          </>
        )}
      </div>
    </Drawer>
  );
};
