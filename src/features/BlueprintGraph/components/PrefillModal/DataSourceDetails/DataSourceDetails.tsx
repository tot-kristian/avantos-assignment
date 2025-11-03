import type { DataSourceItem } from "@/features/BlueprintGraph/model/dataSource/types";
import { InfoRow } from "@/features/BlueprintGraph/components/InfoRow/InfoRow.tsx";

type DataSourceItemDetailsProps = {
  item: DataSourceItem | null;
};

export const DataSourceItemDetails = ({ item }: DataSourceItemDetailsProps) => {
  if (!item) {
    return (
      <div
        className="h-full flex items-center justify-center text-sm text-muted-foreground border rounded-md p-8"
        data-testid="data-source-details-empty"
      >
        Select an item on the left
      </div>
    );
  }

  const typeValue =
    item.valueType === "string"
      ? item.format
        ? `string/${item.format}`
        : "string"
      : item.valueType;

  return (
    <div className="space-y-3">
      <span
        className="font-semibold block"
        data-testid="data-source-details-details"
      >
        Details
      </span>
      <div
        className="text-base font-semibold"
        data-testid="data-source-group-label"
      >
        {item.group} - {item.label}
      </div>
      <div
        className="rounded-md border p-3 text-sm space-y-1"
        data-test-id="data-source-details-rows"
      >
        <InfoRow label="Group" value={item.group} />
        <InfoRow label="Field" value={item.label} />
        <InfoRow label="Type" value={typeValue} />
        <InfoRow
          label="Component key"
          value={item.entry.component_key}
          fontMono
        />
        <InfoRow label="Output key" value={item.entry.output_key} fontMono />
      </div>
    </div>
  );
};
