import { Modal } from "@/components/Modal/Modal.tsx";
import type { ActionBlueprintGraphResponse, GraphNode } from "@/lib/types.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllDataSources } from "@/features/data-source/get-all-data-sources.ts";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import type { DataSourceItem } from "@/features/model/types.ts";
import { cn } from "@/lib/utils.ts";
import { InfoRow } from "@/features/components/InfoRow/InfoRow.tsx";

type Props = {
  open: boolean;
  setModalOpen: (open: boolean) => void;
  graph: ActionBlueprintGraphResponse;
  node: GraphNode;
};

export const PrefillModal = ({ open, setModalOpen, graph, node }: Props) => {
  const globalDataSource = getAllDataSources(graph, node);
  const [selected, setSelected] = useState<DataSourceItem | null>(null);

  const onClose = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const onSelect = () => {};

  return (
    <Modal
      open={open}
      onOpenChange={setModalOpen}
      title="Select data element to map"
      size="wide"
    >
      <div className="flex flex-row justify-between">
        <div>
          <span className="font-semibold">Available data</span>
          {/*TODO add search support*/}
          <Accordion type="multiple" className="w-full">
            {Object.entries(globalDataSource).map(([group, items]) => {
              return (
                <AccordionItem value={group} key={group} className="bg-accent">
                  <AccordionTrigger>{group}</AccordionTrigger>
                  <AccordionContent className="space-y-2 pl-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "text-sm",
                          selected?.id === item.id && "bg-red-500",
                        )}
                        onClick={() => setSelected(item)}
                      >
                        {item.label}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        <div className="flex flex-col">
          <div className="flex-1 p-4">
            {!selected ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Select an item on the left.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-base font-semibold">
                  {`${selected.group} - ${selected.label}`}
                </div>
                <div className="rounded-md border p-3 text-sm">
                  <InfoRow key="Group" value={selected.group} />
                  <InfoRow key="Field" value={selected.label} />
                  <InfoRow
                    key="Type"
                    value={
                      selected.valueType === "string"
                        ? selected.format
                          ? `string/${selected.format}`
                          : "string"
                        : selected.valueType
                    }
                  />
                  <InfoRow
                    key="Component key"
                    value={selected.entry.component_key}
                    fontMono
                  />
                  <InfoRow
                    key="Output key"
                    value={selected.entry.output_key}
                    fontMono
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-x-2">
        <Button variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button variant="outline" onClick={() => onSelect()}>
          Select
        </Button>
      </div>
    </Modal>
  );
};
