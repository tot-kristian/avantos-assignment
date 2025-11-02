import type { ActionBlueprintGraphResponse, GraphNode } from "@/lib/types.ts";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  getFormFieldsWithPrefill,
  getFormForNode,
} from "@/features/model/graph-helpers.ts";
import { PrefillModal } from "@/features/components/PrefillModal/PrefillModal.tsx";
import { useUpdateNodeMapping } from "@/features/hooks/mutations/useUpdateNodeMapping.ts";

type PrefillSheetContentProps = {
  graph: ActionBlueprintGraphResponse;
  node: GraphNode;
};

export const PrefillSheetContent = ({
  graph,
  node,
}: PrefillSheetContentProps) => {
  const form = useMemo(
    () => getFormForNode(graph, node.data.component_id),
    [graph, node],
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const { setField } = useUpdateNodeMapping("1", "1");

  if (!form) return null;
  const formFieldsWithPrefill = getFormFieldsWithPrefill(node, form);

  const clearNode = (fieldToBeRemoved: string) => {
    setField({ selectedField: fieldToBeRemoved, nodeId: node.id });
  };

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
              <div className="font-medium">{key}</div>
              <div className="text-xs text-muted-foreground">
                {/* TODO add value here */}
              </div>
            </div>
            <div className="flex gap-2">
              {hasMapper ? (
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNode(key);
                  }}
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        );
      })}
      <PrefillModal
        open={modalOpen}
        setModalOpen={setModalOpen}
        graph={graph}
        node={node}
        selectedField={selectedField}
      />
    </>
  );
};
