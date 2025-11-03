import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrefillSheetContent } from "./PrefillSheetContent";
import { useGraph } from "../../../hooks/useGraph";
import {
  createMockApiResponse,
  createMockForm,
  createMockNode,
} from "../../../test/utils/mockFactories";

vi.mock("../../../hooks/useGraph");

describe("PrefillSheetContent", () => {
  const mockUpdateNodeMapping = vi.fn();
  const mockClearNode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render empty state when no node is selected", () => {
    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({}),
      selectedNode: null,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: mockClearNode,
      isLoading: false,
    });

    const { container } = render(<PrefillSheetContent />);

    expect(container.firstChild).toBeNull();
  });

  it("should render form fields when node with form is selected", () => {
    const node = createMockNode("node1", "Test Node");
    node.data.component_id = "form1";

    const form = createMockForm(
      {
        username: { type: "string", avantos_type: "short-text" },
        email: { type: "string", avantos_type: "short-text", format: "email" },
      },
      "form1",
    );

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node], forms: [form] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: mockClearNode,
      isLoading: false,
    });

    render(<PrefillSheetContent />);

    expect(screen.getByText("username")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
  });

  it("should render multiple form fields", () => {
    const node = createMockNode("node1", "Test Node");
    node.data.component_id = "form1";

    const form = createMockForm(
      {
        field1: { type: "string", avantos_type: "short-text" },
        field2: { type: "string", avantos_type: "short-text" },
        field3: { type: "array", avantos_type: "multi-select" },
      },
      "form1",
    );

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({
        nodes: [node],
        forms: [form],
      }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: mockClearNode,
      isLoading: false,
    });

    render(<PrefillSheetContent />);

    expect(screen.getByText("field1")).toBeInTheDocument();
    expect(screen.getByText("field2")).toBeInTheDocument();
    expect(screen.getByText("field3")).toBeInTheDocument();
  });

  it("should handle node without form", () => {
    const node = createMockNode("node1", "Test Node");
    node.data.component_id = "nonexistent_form";

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: mockClearNode,
      isLoading: false,
    });

    const { container } = render(<PrefillSheetContent />);

    expect(container.firstChild).toBeNull();
  });

  it("should handle node with empty form", () => {
    const node = createMockNode("node1", "Test Node");
    node.data.component_id = "form1";

    const form = createMockForm({}, "form1");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({
        nodes: [node],
        forms: [form],
      }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: mockClearNode,
      isLoading: false,
    });

    render(<PrefillSheetContent />);

    // Should render but with no fields
    expect(
      screen.queryByRole("button", { name: /select mapping/i }),
    ).not.toBeInTheDocument();
  });

  it("should render select mapping buttons for fields", () => {
    const node = createMockNode("node1", "Test Node");
    node.data.component_id = "form1";

    const form = createMockForm(
      {
        username: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({
        nodes: [node],
        forms: [form],
      }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: mockClearNode,
      isLoading: false,
    });

    render(<PrefillSheetContent />);

    expect(
      screen.getByTestId("prefill-sheet-content-select-div"),
    ).toBeInTheDocument();
  });

  it("should show mapped field when mapping exists", () => {
    const node = createMockNode("node1", "Test Node", {
      username: {
        type: "form_field",
        component_key: "parent_component",
        output_key: "parent_field",
        is_metadata: false,
      },
    });
    node.data.component_id = "form1";

    const form = createMockForm(
      {
        username: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({
        nodes: [node],
        forms: [form],
      }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: mockClearNode,
      isLoading: false,
    });

    render(<PrefillSheetContent />);

    expect(screen.getByText("username")).toBeInTheDocument();
    expect(
      screen.getByTestId("prefill-sheet-content-clear-button"),
    ).toBeInTheDocument();
  });
});
