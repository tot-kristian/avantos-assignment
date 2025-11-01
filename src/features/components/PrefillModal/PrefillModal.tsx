import { Modal } from "@/components/Modal/Modal.tsx";
import type { ActionBlueprintGraphResponse, GraphNode } from "@/lib/types.ts";
import { GlobalSource } from "@/features/data-source/global.ts";
import type { DataSourceItem } from "@/features/model/types.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DirectParentDataSource } from "@/features/data-source/direct-parent.ts";

type Props = {
  open: boolean;
  setModalOpen: (open: boolean) => void;
  graph: ActionBlueprintGraphResponse;
  node: GraphNode;
};

export const PrefillModal = ({ open, setModalOpen, graph, node }: Props) => {
  const dataSources = [GlobalSource, DirectParentDataSource];

  const globalDataSource = dataSources
    .flatMap((ds) => ds.listFor({ graph, targetNodeId: node.id }))
    .reduce<Record<string, DataSourceItem[]>>((acc, curr) => {
      if (acc[curr.group]) {
        acc[curr.group].push(curr);
      } else {
        acc[curr.group] = [curr];
      }
      return acc;
    }, {});

  console.log(globalDataSource);

  return (
    <Modal
      open={open}
      onOpenChange={setModalOpen}
      title="Select data element to map"
      size="wide"
    >
      <div className="flex flex-row justify-between">
        <div>
          Available data
          {/*TODO add search support*/}
          <Accordion type="multiple" className="w-full">
            {Object.entries(globalDataSource).map(([group, items]) => {
              return (
                <AccordionItem value={group} key={group}>
                  <AccordionTrigger>{group}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    {items.map((item) => item.label).join(", ")}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        <div>Second column</div>
      </div>
    </Modal>
  );
};
