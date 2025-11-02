import { Modal } from "@/components/Modal/Modal.tsx";
import { getAllDataSources } from "@/features/data-source/get-all-data-sources.ts";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useMemo, useState } from "react";
import type {
  DataSourceItem,
  DataSourceItemWithGroup,
} from "@/features/model/types.ts";
import { findSelectedDataSourceItemAndGroup } from "@/features/model/graph-helpers.ts";
import { useGraph } from "@/features/hooks/useGraph.ts";
import { DataSourceItemDetails } from "@/features/components/PrefillModal/DataSourceDetails/DataSourceDetails.tsx";
import { DataSourceList } from "@/features/components/PrefillModal/DataSourceList/DataSourceList.tsx";

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

  const { group, item } = useMemo(
    () =>
      findSelectedDataSourceItemAndGroup({
        dataSources,
        selectedField,
        inputMapping: node?.data.input_mapping ?? {},
      }) || ({} as Partial<DataSourceItemWithGroup>),
    [dataSources, selectedField, node],
  );

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

  const hasSelection = !!selectedDataSourceItem;

  return (
    <Modal
      open={open}
      onOpenChange={setModalOpen}
      title="Select data element to map"
      description="Select elements from the lists below"
      size="wide"
    >
      <div className="flex flex-row justify-between gap-3 overflow-y-scroll max-h-[70vh]">
        <div>
          <span className="font-semibold">Available data</span>
          <DataSourceList
            dataSources={dataSources}
            selectedItem={selectedDataSourceItem}
            onSelectItem={setSelectedDataSourceItem}
            defaultExpandedGroup={group}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold mb-3 text-sm">Details</span>
          <div className="flex-1 border rounded-md bg-muted/30 p-4 min-w-[500px]">
            <DataSourceItemDetails item={selectedDataSourceItem} />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-x-2 mt-3">
        <Button variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button
          variant="outline"
          disabled={!hasSelection}
          className={!hasSelection ? "opacity-50 cursor-not-allowed" : ""}
          onClick={() => onSelect()}
        >
          Select
        </Button>
      </div>
    </Modal>
  );
};
