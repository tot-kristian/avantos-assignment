// DataSourceList.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { DataSourceItem } from "@/features/model/types";
import { cn } from "@/lib/utils";

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
          <AccordionContent className="space-y-2 pl-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "text-sm text-left w-full p-2 rounded transition-colors hover:bg-accent",
                  selectedItem?.id === item.id &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => onSelectItem(item)}
              >
                {item.label}
              </button>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
