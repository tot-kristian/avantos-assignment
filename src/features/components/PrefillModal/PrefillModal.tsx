import { Modal } from "@/components/Modal/Modal.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllDataSources } from "@/features/data-source/get-all-data-sources.ts";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useMemo, useState } from "react";
import type { DataSourceItem } from "@/features/model/types.ts";
import { cn } from "@/lib/utils.ts";
import { InfoRow } from "@/features/components/InfoRow/InfoRow.tsx";
import { findSelectedFieldKeyAndGroup } from "@/features/model/graph-helpers.ts";
import { useGraph } from "@/features/hooks/useGraph.ts";

type PrefillModalProps = {
  open: boolean;
  setModalOpen: (open: boolean) => void;
  selectedField: string | null;
};

export const PrefillModal = ({
  open,
  setModalOpen,
  selectedField,
}: PrefillModalProps) => {
  const { graphData, updateNodeMapping, selectedNode: node } = useGraph();

  const dataSources = useMemo(() => {
    if (!node?.id) return {};
    return getAllDataSources(graphData, node.id);
  }, [graphData, node?.id]);

  const [selectedDataSourceItem, setSelectedDataSourceItem] =
    useState<DataSourceItem | null>(null);

  const { group, item } =
    findSelectedFieldKeyAndGroup({
      dataSources,
      selectedField,
      inputMapping: node?.data.input_mapping ?? {},
    }) || {};

  useEffect(() => {
    if (open) {
      setSelectedDataSourceItem(item ?? null);
    }
  }, [open, selectedField, item]);

  const onClose = () => {
    setModalOpen(false);
    setSelectedDataSourceItem(null);
  };

  const onSelect = () => {
    if (!selectedDataSourceItem || !selectedField) return;
    updateNodeMapping(selectedField, selectedDataSourceItem.entry);
    setModalOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={setModalOpen}
      title="Select data element to map"
      description="Select elements from the lists below"
      size="wide"
    >
      <div className="flex flex-row justify-between">
        <div>
          <span className="font-semibold">Available data</span>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={group ? [group] : []}
          >
            {Object.entries(dataSources).map(([group, items]) => {
              return (
                <AccordionItem value={group} key={group} className="bg-accent">
                  <AccordionTrigger>{group}</AccordionTrigger>
                  <AccordionContent className="space-y-2 pl-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "text-sm",
                          selectedDataSourceItem?.id === item.id &&
                            "bg-red-500",
                        )}
                        onClick={() => setSelectedDataSourceItem(item)}
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
            {!selectedDataSourceItem ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Select an item on the left.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-base font-semibold">
                  {`${selectedDataSourceItem.group} - ${selectedDataSourceItem.label}`}
                </div>
                <div className="rounded-md border p-3 text-sm">
                  <InfoRow label="Group" value={selectedDataSourceItem.group} />
                  <InfoRow label="Field" value={selectedDataSourceItem.label} />
                  <InfoRow
                    label="Type"
                    value={
                      selectedDataSourceItem.valueType === "string"
                        ? selectedDataSourceItem.format
                          ? `string/${selectedDataSourceItem.format}`
                          : "string"
                        : selectedDataSourceItem.valueType
                    }
                  />
                  <InfoRow
                    label="Component key"
                    value={selectedDataSourceItem.entry.component_key}
                    fontMono
                  />
                  <InfoRow
                    label="Output key"
                    value={selectedDataSourceItem.entry.output_key}
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
        <Button
          variant="outline"
          disabled={!selectedDataSourceItem}
          onClick={() => onSelect()}
        >
          Select
        </Button>
      </div>
    </Modal>
  );
};
