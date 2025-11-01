import type { ActionBlueprintGraphResponse, GraphNode } from "@/lib/types.ts";
import { useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  getFormFieldsWithPrefill,
  getFormForNode,
} from "@/features/model/graph-helpers.ts";

type Props = {
  graph: ActionBlueprintGraphResponse;
  node: GraphNode;
};
export const PrefillSheetContent = ({ graph, node }: Props) => {
  const form = useMemo(
    () => getFormForNode(graph, node.data.component_id),
    [graph, node],
  );
  if (!form) return null;

  const formFieldsWithPrefill = getFormFieldsWithPrefill(node, form);

  return (
    <>
      {formFieldsWithPrefill.map(({ key, hasMapper }) => {
        return (
          <div
            key={key}
            className="flex items-center justify-between border rounded p-2"
          >
            <div>
              <div className="font-medium">{key}</div>
              <div className="text-xs text-muted-foreground">
                {/* TODO add value here */}
              </div>
            </div>
            <div className="flex gap-2">
              {hasMapper ? <Button variant="ghost">Clear</Button> : null}
            </div>
          </div>
        );
      })}
    </>
  );
};
