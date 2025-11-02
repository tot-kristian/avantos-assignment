import type { ApiMappingEntry } from "@/features/BlueprintGraph/api/types";
import type {
  DataSourceItemWithGroup,
  DataSourceMap,
} from "@/features/BlueprintGraph/model/dataSource/types";

export const findSelectedDataSourceItemAndGroup = ({
  inputMapping,
  selectedField,
  dataSources,
}: {
  inputMapping: Record<string, ApiMappingEntry>;
  selectedField?: string | null;
  dataSources: DataSourceMap;
}): DataSourceItemWithGroup | undefined => {
  if (!selectedField || !Object.keys(inputMapping).length) return;
  const currentMapping = inputMapping[selectedField];

  if (!currentMapping) return;
  const { component_key, output_key } = currentMapping;
  for (const [group, items] of Object.entries(dataSources)) {
    const item = items.find(
      (item) =>
        item.entry.component_key === component_key && item.label === output_key,
    );
    if (item) {
      return { group, item };
    }
  }
};
