import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataSourceItemDetails } from "./DataSourceDetails";
import type { DataSourceItem } from "@/features/BlueprintGraph/model/dataSource/types";

describe("DataSourceDetails", () => {
  const mockItem: DataSourceItem = {
    id: "test-id",
    group: "Test Group",
    label: "Test Label",
    valueType: "string",
    entry: {
      type: "form_field",
      component_key: "test_component",
      output_key: "test_output",
      is_metadata: false,
    },
  };

  it("should render empty state with data-testid when item is null", () => {
    render(<DataSourceItemDetails item={null} />);

    expect(screen.getByTestId("data-source-details-empty")).toBeInTheDocument();
  });

  it("should render group label", () => {
    render(<DataSourceItemDetails item={mockItem} />);

    expect(screen.getByTestId("data-source-group-label")).toBeInTheDocument();
  });

  it("should render all data-testids when item is provided", () => {
    render(<DataSourceItemDetails item={mockItem} />);

    expect(screen.getAllByTestId("info-row-label").length).toBe(5);
  });

  it("should render correct values for group", () => {
    render(<DataSourceItemDetails item={mockItem} />);

    const group = screen.getAllByTestId("info-row-value")[0];
    expect(group).toHaveTextContent("Test Group");
  });

  it("should render correct values for field", () => {
    render(<DataSourceItemDetails item={mockItem} />);

    const field = screen.getAllByTestId("info-row-value")[1];
    expect(field).toHaveTextContent("Test Label");
  });

  it("should render data-testid for format when format is provided", () => {
    const itemWithFormat: DataSourceItem = {
      ...mockItem,
      format: "email",
    };

    render(<DataSourceItemDetails item={itemWithFormat} />);

    const format = screen.getAllByTestId("info-row-value")[2];
    expect(format).toHaveTextContent("string/email");
  });

  it("should render correct values for component key", () => {
    render(<DataSourceItemDetails item={mockItem} />);

    const componentKey = screen.getAllByTestId("info-row-value")[3];
    expect(componentKey).toHaveTextContent("test_component");
  });

  it("should render correct values for output key", () => {
    render(<DataSourceItemDetails item={mockItem} />);

    const outputKey = screen.getAllByTestId("info-row-value")[4];
    expect(outputKey).toHaveTextContent("test_output");
  });
});
