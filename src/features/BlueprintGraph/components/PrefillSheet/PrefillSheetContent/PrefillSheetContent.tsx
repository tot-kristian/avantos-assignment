import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { getFormForNode } from "@/features/BlueprintGraph/model/graphHelpers";
import { PrefillModal } from "@/features/BlueprintGraph/components/PrefillModal/PrefillModal.tsx";
import { XIcon } from "lucide-react";
import { useGraph } from "@/features/BlueprintGraph/hooks/useGraph.ts";
import { getFormFieldsWithPrefill } from "@/features/BlueprintGraph/model/getFormFieldsWithPrefill.ts";

export const PrefillSheetContent = () => {
  const { graphData, clearNode, selectedNode: node } = useGraph();

  const form = useMemo(() => {
    if (!node) return;
    return getFormForNode(graphData, node.data.component_id);
  }, [graphData, node]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  if (!form || !node) return null;
  const formFieldsWithPrefill = getFormFieldsWithPrefill(node, form);

  return (
    <>
      {formFieldsWithPrefill.map(({ key, hasMapper }) => {
        return (
          <div
            key={key}
            className="flex items-center justify-between border rounded p-2"
            onClick={() => {
              setSelectedField(key);
              setModalOpen(true);
            }}
          >
            <div>
              <span className="font-medium">{key}</span>
            </div>
            <div className="flex gap-2">
              {hasMapper ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNode(key);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              ) : null}
            </div>
          </div>
        );
      })}
      <PrefillModal
        open={modalOpen}
        setModalOpen={setModalOpen}
        selectedField={selectedField}
      />
    </>
  );
};
