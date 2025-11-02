import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GraphCanvas } from "./GraphCanvas";
import { createMockNode } from "@/features/BlueprintGraph/test/utils/mockFactories";

describe("GraphCanvas", () => {
  const mockSetSelectedNode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render empty when no nodes provided", () => {
    const { container } = render(
      <GraphCanvas nodes={[]} setSelectedNode={mockSetSelectedNode} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render multiple nodes", () => {
    const nodes = [
      createMockNode("node1", "Node 1"),
      createMockNode("node2", "Node 2"),
      createMockNode("node3", "Node 3"),
    ];

    render(<GraphCanvas nodes={nodes} setSelectedNode={mockSetSelectedNode} />);

    expect(screen.getAllByTestId("node-card")).toHaveLength(3);
    expect(screen.getByText("Node 1")).toBeInTheDocument();
    expect(screen.getByText("Node 2")).toBeInTheDocument();
    expect(screen.getByText("Node 3")).toBeInTheDocument();
  });
});
