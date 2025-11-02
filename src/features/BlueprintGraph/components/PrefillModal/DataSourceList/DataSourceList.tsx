// DataSourceList.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import type { DataSourceItem } from "@/features/BlueprintGraph/model/dataSource/types";
import { cn } from "@/lib/utils.ts";

type DataSourceListProps = {
  dataSources: Record<string, DataSourceItem[]>;
  selectedItem: DataSourceItem | null;
  onSelectItem: (item: DataSourceItem) => void;
  defaultExpandedGroup?: string;
};

export const DataSourceList = ({
  dataSources,
  selectedItem,
  onSelectItem,
  defaultExpandedGroup,
}: DataSourceListProps) => {
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={defaultExpandedGroup ? [defaultExpandedGroup] : []}
    >
      {Object.entries(dataSources).map(([group, items]) => (
        <AccordionItem value={group} key={group} className="bg-accent">
          <AccordionTrigger>{group}</AccordionTrigger>
          <AccordionContent className="space-y-2 pl-4 pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "text-sm text-left w-full p-2 rounded transition-colors hover:bg-accent",
                  selectedItem?.id === item.id && "border border-gray-300",
                )}
                onClick={() => onSelectItem(item)}
              >
                {item.label}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
