import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Graph } from "./Graph";
import { useGraph } from "../../hooks/useGraph";
import {
  createMockApiResponse,
  createMockNode,
} from "../../test/utils/mockFactories";

vi.mock("../../hooks/useGraph");

describe("Graph", () => {
  const mockSetSelectedNode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({}),
      selectedNode: null,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: true,
    });

    render(<Graph />);

    expect(screen.getByTestId("graph-loading")).toBeInTheDocument();
  });

  it("should render nodes from graph data", () => {
    const node1 = createMockNode("node1", "First Node");
    const node2 = createMockNode("node2", "Second Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node1, node2] }),
      selectedNode: null,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<Graph />);

    expect(screen.getByText("First Node")).toBeInTheDocument();
    expect(screen.getByText("Second Node")).toBeInTheDocument();
  });

  it("should render correct number of nodes", () => {
    const nodes = [
      createMockNode("node1", "Node 1"),
      createMockNode("node2", "Node 2"),
      createMockNode("node3", "Node 3"),
    ];

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes }),
      selectedNode: null,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<Graph />);

    expect(screen.getAllByTestId("node-card")).toHaveLength(3);
  });

  it("should handle empty graph data", () => {
    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({}),
      selectedNode: null,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<Graph />);

    expect(screen.queryByTestId("node-card")).not.toBeInTheDocument();
  });

  it("should call setSelectedNode when node is clicked", async () => {
    const user = userEvent.setup();
    const node1 = createMockNode("node1", "Clickable Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node1] }),
      selectedNode: null,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<Graph />);

    const nodeCard = screen.getByTestId("node-card");
    await user.click(nodeCard);

    expect(mockSetSelectedNode).toHaveBeenCalledWith(node1);
  });

  it("should render graph canvas", () => {
    const nodes = [createMockNode("node1", "Node 1")];

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes }),
      selectedNode: null,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<Graph />);

    expect(screen.getByTestId("graph-canvas")).toBeInTheDocument();
  });

  it("should show PrefillSheet when node is selected", () => {
    const selectedNode = createMockNode("node1", "Selected Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [selectedNode] }),
      selectedNode: selectedNode,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<Graph />);

    expect(screen.getByTestId("prefill-sheet")).toBeInTheDocument();
  });

  it("should handle multiple nodes with same name", () => {
    const node1 = createMockNode("node1", "Duplicate Name");
    const node2 = createMockNode("node2", "Duplicate Name");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node1, node2] }),
      selectedNode: null,
      setSelectedNode: mockSetSelectedNode,
      updateNodeMapping: vi.fn(),
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(<Graph />);

    const cards = screen.getAllByTestId("node-card");
    expect(cards).toHaveLength(2);
  });
});
