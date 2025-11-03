import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrefillSheet } from "./PrefillSheet";
import { useGraph } from "../../hooks/useGraph";
import {
  createMockApiResponse,
  createMockForm,
  createMockNode,
} from "../../test/utils/mockFactories";

vi.mock("../../hooks/useGraph");
vi.mock("../PrefillSheetContent/PrefillSheetContent", () => ({
  PrefillSheetContent: () => (
    <div data-testid="prefill-sheet-content">Sheet Content</div>
  ),
}));

describe("PrefillSheet", () => {
  const mockSetSelectedNode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render drawer when no node is selected", () => {
    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({}),
      selectedNode: null,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<PrefillSheet />);

    expect(screen.queryByTestId("prefill-sheet")).not.toBeInTheDocument();
  });

  it("should render drawer when node is selected", () => {
    const selectedNode = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [selectedNode] }),
      selectedNode: selectedNode,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<PrefillSheet />);

    expect(screen.getByTestId("prefill-sheet")).toBeInTheDocument();
  });

  it("should display node ID and node name when node is selected", () => {
    const selectedNode = createMockNode("node123", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [selectedNode] }),
      selectedNode: selectedNode,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<PrefillSheet />);

    expect(screen.getByTestId("prefill-sheet-node-id")).toHaveTextContent(
      "Node ID: node123",
    );

    expect(screen.getByTestId("prefill-sheet-name")).toHaveTextContent(
      "Name: Test Node",
    );
  });

  it("should render PrefillSheetContent when node is selected", () => {
    const selectedNode = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({
        nodes: [selectedNode],
        forms: [createMockForm({}, "form_id")],
      }),
      selectedNode: selectedNode,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<PrefillSheet />);

    expect(screen.getByTestId("prefill-sheet-content")).toBeInTheDocument();
  });

  it("should have correct drawer title and description", () => {
    const selectedNode = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [selectedNode] }),
      selectedNode: selectedNode,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<PrefillSheet />);

    expect(screen.getByText("Prefill Form")).toBeInTheDocument();
    expect(
      screen.getByText("Configure the form prefill settings"),
    ).toBeInTheDocument();
  });
});
