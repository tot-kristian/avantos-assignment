import { findSelectedDataSourceItemAndGroup } from "./findSelectedDataSourceItemAndGroup";
import type { ApiMappingEntry } from "@/features/BlueprintGraph/api/types";
import type { DataSourceMap } from "@/features/BlueprintGraph/model/dataSource/types";

describe("findSelectedDataSourceItemAndGroup", () => {
  const mockMappingEntry: ApiMappingEntry = {
    component_key: "component1",
    output_key: "field1",
    is_metadata: false,
    type: "form_field",
  };

  const mockDataSources: DataSourceMap = {
    "Group 1": [
      {
        id: "item1",
        group: "Group 1",
        label: "field1",
        valueType: "string" as const,
        entry: {
          component_key: "component1",
          output_key: "field1",
          is_metadata: false,
          type: "form_field",
        },
      },
      {
        id: "item2",
        group: "Group 1",
        label: "field2",
        valueType: "string",
        entry: {
          component_key: "component1",
          output_key: "field2",
          is_metadata: false,
          type: "form_field",
        },
      },
    ],
    "Group 2": [
      {
        id: "item3",
        group: "Group 2",
        label: "field3",
        valueType: "string",
        entry: {
          component_key: "component2",
          output_key: "field3",
          is_metadata: false,
          type: "form_field",
        },
      },
    ],
  };

  describe("should handle null/undefined/empty values", () => {
    it("should return undefined when selectedField is null", () => {
      const result = findSelectedDataSourceItemAndGroup({
        inputMapping: { field1: mockMappingEntry },
        selectedField: null,
        dataSources: mockDataSources,
      });

      expect(result).toBeUndefined();
    });

    it("should return undefined when selectedField is undefined", () => {
      const result = findSelectedDataSourceItemAndGroup({
        inputMapping: { field1: mockMappingEntry },
        selectedField: undefined,
        dataSources: mockDataSources,
      });

      expect(result).toBeUndefined();
    });

    it("should return undefined when inputMapping is empty", () => {
      const result = findSelectedDataSourceItemAndGroup({
        inputMapping: {},
        selectedField: "field1",
        dataSources: mockDataSources,
      });

      expect(result).toBeUndefined();
    });

    it("should return undefined when selectedField is not in inputMapping", () => {
      const result = findSelectedDataSourceItemAndGroup({
        inputMapping: { field1: mockMappingEntry },
        selectedField: "nonexistentField",
        dataSources: mockDataSources,
      });

      expect(result).toBeUndefined();
    });

    it("should handle empty dataSources", () => {
      const result = findSelectedDataSourceItemAndGroup({
        inputMapping: { field1: mockMappingEntry },
        selectedField: "field1",
        dataSources: {},
      });

      expect(result).toBeUndefined();
    });
  });

  it("should find and return the correct item and group when match exists", () => {
    const result = findSelectedDataSourceItemAndGroup({
      inputMapping: { field1: mockMappingEntry },
      selectedField: "field1",
      dataSources: mockDataSources,
    });

    expect(result).toEqual({
      group: "Group 1",
      item: mockDataSources["Group 1"][0],
    });
  });

  it("should find item in the second group", () => {
    const inputMapping: Record<string, ApiMappingEntry> = {
      field3: {
        component_key: "component2",
        output_key: "field3",
        type: "form_field",
        is_metadata: false,
      },
    };

    const result = findSelectedDataSourceItemAndGroup({
      inputMapping,
      selectedField: "field3",
      dataSources: mockDataSources,
    });

    expect(result).toEqual({
      group: "Group 2",
      item: mockDataSources["Group 2"][0],
    });
  });

  it("should return undefined when component_key matches but output_key does not", () => {
    const inputMapping: Record<string, ApiMappingEntry> = {
      field1: {
        component_key: "component1",
        output_key: "nonexistentOutput",
        is_metadata: false,
        type: "form_field",
      },
    };

    const result = findSelectedDataSourceItemAndGroup({
      inputMapping,
      selectedField: "field1",
      dataSources: mockDataSources,
    });

    expect(result).toBeUndefined();
  });

  it("should return undefined when output_key matches but component_key does not", () => {
    const inputMapping: Record<string, ApiMappingEntry> = {
      field1: {
        component_key: "nonexistentComponent",
        output_key: "field1",
        type: "form_field",
        is_metadata: false,
      },
    };

    const result = findSelectedDataSourceItemAndGroup({
      inputMapping,
      selectedField: "field1",
      dataSources: mockDataSources,
    });

    expect(result).toBeUndefined();
  });

  it("should return the first matching item when multiple items match", () => {
    const duplicateDataSources: DataSourceMap = {
      "Group 1": [
        {
          id: "item1",
          group: "Group 1",
          label: "field1",
          valueType: "string" as const,
          entry: {
            component_key: "component1",
            output_key: "field1",
            type: "form_field",
            is_metadata: false,
          },
        },
        {
          id: "item2",
          group: "Group 1",
          label: "field1",
          valueType: "string" as const,
          entry: {
            component_key: "component1",
            output_key: "field1",
            type: "form_field",
            is_metadata: false,
          },
        },
      ],
    };

    const result = findSelectedDataSourceItemAndGroup({
      inputMapping: { field1: mockMappingEntry },
      selectedField: "field1",
      dataSources: duplicateDataSources,
    });

    expect(result?.item.id).toBe("item1");
  });

  it("should handle items with different valueTypes", () => {
    const dataSourcesWithTypes: DataSourceMap = {
      "Group 1": [
        {
          id: "item1",
          group: "Group 1",
          label: "arrayField",
          valueType: "array" as const,
          entry: {
            component_key: "component1",
            output_key: "arrayField",
            type: "form_field",
            is_metadata: false,
          },
        },
        {
          id: "item2",
          group: "Group 1",
          label: "objectField",
          valueType: "object" as const,
          entry: {
            component_key: "component1",
            output_key: "objectField",
            type: "form_field",
            is_metadata: false,
          },
        },
      ],
    };

    const inputMapping: Record<string, ApiMappingEntry> = {
      arrayField: {
        component_key: "component1",
        output_key: "arrayField",
        type: "form_field",
        is_metadata: false,
      },
    };

    const result = findSelectedDataSourceItemAndGroup({
      inputMapping,
      selectedField: "arrayField",
      dataSources: dataSourcesWithTypes,
    });

    expect(result?.item.valueType).toBe("array");
  });
});
