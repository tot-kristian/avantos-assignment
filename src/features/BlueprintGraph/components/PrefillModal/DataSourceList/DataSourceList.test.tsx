import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataSourceList } from "./DataSourceList";
import type { DataSourceItem } from "@/features/BlueprintGraph/model/dataSource/types";

describe("DataSourceList", () => {
  const mockOnSelectItem = vi.fn();

  const createMockDataSourceItem = (
    id: string,
    label: string,
    group: string,
  ): DataSourceItem => ({
    id,
    label,
    group,
    valueType: "string",
    entry: {
      type: "form_field",
      component_key: "test_component",
      output_key: label,
      is_metadata: false,
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render empty accordion when no data sources provided", () => {
    render(
      <DataSourceList
        dataSources={{}}
        selectedItem={null}
        onSelectItem={mockOnSelectItem}
      />,
    );

    expect(
      screen.queryByTestId("data-source-list-group"),
    ).not.toBeInTheDocument();
  });

  it("should render groups from data sources", () => {
    const dataSources = {
      "Group 1": [createMockDataSourceItem("1", "Field 1", "Group 1")],
      "Group 2": [createMockDataSourceItem("2", "Field 2", "Group 2")],
    };

    render(
      <DataSourceList
        dataSources={dataSources}
        selectedItem={null}
        onSelectItem={mockOnSelectItem}
      />,
    );

    expect(screen.getByText("Group 1")).toBeInTheDocument();
    expect(screen.getByText("Group 2")).toBeInTheDocument();
  });

  it("should render items within groups", async () => {
    const user = userEvent.setup();

    const dataSources = {
      "Group 1": [
        createMockDataSourceItem("1", "Field 1", "Group 1"),
        createMockDataSourceItem("2", "Field 2", "Group 1"),
      ],
    };

    render(
      <DataSourceList
        dataSources={dataSources}
        selectedItem={null}
        onSelectItem={mockOnSelectItem}
      />,
    );

    const dataSourceGroupListButton = screen.getByTestId(
      "data-source-list-group",
    );

    await user.click(dataSourceGroupListButton);

    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Field 2")).toBeInTheDocument();
  });

  it("should call onSelectItem when item is clicked", async () => {
    const user = userEvent.setup();
    const item = createMockDataSourceItem("1", "Field 1", "Group 1");
    const dataSources = {
      "Group 1": [item],
    };

    render(
      <DataSourceList
        dataSources={dataSources}
        selectedItem={null}
        onSelectItem={mockOnSelectItem}
      />,
    );
    const dataSourceGroupListButton = screen.getByTestId(
      "data-source-list-group",
    );

    await user.click(dataSourceGroupListButton);

    const itemElement = screen.getByText("Field 1");
    await user.click(itemElement);

    expect(mockOnSelectItem).toHaveBeenCalledWith(item);
  });

  it("should render multiple items in same group", async () => {
    const user = userEvent.setup();
    const dataSources = {
      "Group 1": [
        createMockDataSourceItem("1", "Field 1", "Group 1"),
        createMockDataSourceItem("2", "Field 2", "Group 1"),
        createMockDataSourceItem("3", "Field 3", "Group 1"),
      ],
    };

    render(
      <DataSourceList
        dataSources={dataSources}
        selectedItem={null}
        onSelectItem={mockOnSelectItem}
      />,
    );

    const dataSourceGroupListButton = screen.getByTestId(
      "data-source-list-group",
    );
    await user.click(dataSourceGroupListButton);

    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Field 2")).toBeInTheDocument();
    expect(screen.getByText("Field 3")).toBeInTheDocument();
  });

  it("should expand default group when defaultExpandedGroup is provided", () => {
    const dataSources = {
      "Group 1": [createMockDataSourceItem("1", "Field 1", "Group 1")],
      "Group 2": [createMockDataSourceItem("2", "Field 2", "Group 2")],
    };

    render(
      <DataSourceList
        dataSources={dataSources}
        selectedItem={null}
        onSelectItem={mockOnSelectItem}
        defaultExpandedGroup="Group 1"
      />,
    );

    // Both groups should be rendered
    expect(screen.getByText("Group 1")).toBeInTheDocument();
    expect(screen.getByText("Group 2")).toBeInTheDocument();
  });
});
