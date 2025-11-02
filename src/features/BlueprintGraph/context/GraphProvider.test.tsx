import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GraphProvider } from "./GraphProvider";
import { getBlueprintsGraphData } from "@/features/BlueprintGraph/api/getBlueprintsGraphData";
import { useGraph } from "../hooks/useGraph";
import {
  createMockApiResponse,
  createMockNode,
} from "@/features/BlueprintGraph/test/utils/mockFactories.ts";
import userEvent from "@testing-library/user-event";

vi.mock("@/features/BlueprintGraph/api/getBlueprintsGraphData");

const TestConsumer = () => {
  const {
    graphData,
    selectedNode,
    setSelectedNode,
    updateNodeMapping,
    clearNode,
    isLoading,
  } = useGraph();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="node-count">{graphData?.nodes.length ?? 0}</div>
      <div data-testid="selected-node-id">{selectedNode?.id ?? "none"}</div>
      <div data-testid="selected-node-mappings">
        {selectedNode?.data.input_mapping
          ? JSON.stringify(selectedNode.data.input_mapping)
          : "no mappings"}
      </div>

      {graphData?.nodes.map((node) => (
        <button key={node.id} onClick={() => setSelectedNode(node)}>
          Select {node.id}
        </button>
      ))}

      <button
        onClick={() =>
          updateNodeMapping("email", {
            component_key: "components",
            type: "string",
            is_metadata: false,
            output_key: "output",
          })
        }
      >
        Add Email Mapping
      </button>

      <button onClick={() => clearNode("email")}>Clear Email Mapping</button>
    </div>
  );
};

const renderWithProvider = (
  tenantId = "tenant-1",
  blueprintId = "blueprint-1",
) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <GraphProvider tenantId={tenantId} blueprintId={blueprintId}>
        <TestConsumer />
      </GraphProvider>
    </QueryClientProvider>,
  );
};

describe("GraphProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading State", () => {
    it("shows loading state while fetching data", () => {
      vi.mocked(getBlueprintsGraphData).mockReturnValue(new Promise(() => {}));

      renderWithProvider();

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Graph Data", () => {
    it("loads and provides graph data", async () => {
      const mockGraph = createMockApiResponse({
        nodes: [
          createMockNode("node1", "Node 1"),
          createMockNode("node2", "Node 2"),
        ],
      });
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("node-count")).toHaveTextContent("2");
      });
    });

    it("fetches data with correct params", async () => {
      const mockGraph = createMockApiResponse({});
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider("my-tenant", "my-blueprint");

      await waitFor(() => {
        expect(getBlueprintsGraphData).toHaveBeenCalledWith({
          tenantId: "my-tenant",
          blueprintId: "my-blueprint",
        });
      });
    });
  });

  describe("Node Selection", () => {
    it("initially has no selected node", async () => {
      const mockGraph = createMockApiResponse({
        nodes: [createMockNode("node-1", "Node 1")],
      });
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("selected-node-id")).toHaveTextContent(
          "none",
        );
      });
    });

    it("allows selecting a node", async () => {
      const user = userEvent.setup();
      const mockGraph = createMockApiResponse({
        nodes: [createMockNode("node-1", "Node 1")],
      });
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /select node-1/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /select node-1/i }));

      expect(screen.getByTestId("selected-node-id")).toHaveTextContent(
        "node-1",
      );
    });

    it("can change selected node", async () => {
      const user = userEvent.setup();
      const mockGraph = createMockApiResponse({
        nodes: [
          createMockNode("node-1", "Node 1"),
          createMockNode("node-2", "Node 2"),
        ],
      });
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /select node-1/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /select node-1/i }));
      expect(screen.getByTestId("selected-node-id")).toHaveTextContent(
        "node-1",
      );

      await user.click(screen.getByRole("button", { name: /select node-2/i }));
      expect(screen.getByTestId("selected-node-id")).toHaveTextContent(
        "node-2",
      );
    });
  });

  describe("Selected Node Sync", () => {
    it("updates selected node when graph data changes", async () => {
      const user = userEvent.setup();
      const node = createMockNode("node-1", "Node 1");
      const mockGraph = createMockApiResponse({ nodes: [node] });

      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /select node-1/i }),
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole("button", { name: /select node-1/i }));

      expect(screen.getByTestId("selected-node-id")).toHaveTextContent(
        "node-1",
      );
      expect(screen.getByTestId("selected-node-mappings")).toHaveTextContent(
        "{}",
      );

      // Simulate adding a mapping (this would trigger a re-fetch in real app)
      await user.click(
        screen.getByRole("button", { name: /add email mapping/i }),
      );

      // The selected node should sync with updated data
      await waitFor(() => {
        const mappingsText = screen.getByTestId(
          "selected-node-mappings",
        ).textContent;
        expect(mappingsText).toContain("email");
      });
    });
  });

  describe("Update Node Mapping", () => {
    it("does nothing if no node is selected", async () => {
      const user = userEvent.setup();
      const mockGraph = createMockApiResponse({
        nodes: [createMockNode("node-1", "Node1")],
      });
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("node-count")).toHaveTextContent("1");
      });

      // Don't select a node, just try to update
      await user.click(
        screen.getByRole("button", { name: /add email mapping/i }),
      );

      // Should not crash, selected node should still be none
      expect(screen.getByTestId("selected-node-id")).toHaveTextContent("none");
    });

    it("updates node mapping when node is selected", async () => {
      const user = userEvent.setup();
      const node = createMockNode("node-1", "Node 1");
      const mockGraph = createMockApiResponse({ nodes: [node] });
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /select node-1/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /select node-1/i }));
      await user.click(
        screen.getByRole("button", { name: /add email mapping/i }),
      );

      // The mapping should be added to the node
      await waitFor(() => {
        const mappingsText = screen.getByTestId(
          "selected-node-mappings",
        ).textContent;
        expect(mappingsText).toContain("email");
      });
    });
  });

  describe("Clear Node Mapping", () => {
    it("does nothing if no node is selected", async () => {
      const user = userEvent.setup();
      const mockGraph = createMockApiResponse({
        nodes: [createMockNode("node-1", "Node 1")],
      });
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId("node-count")).toHaveTextContent("1");
      });

      // Don't select a node, just try to clear
      await user.click(
        screen.getByRole("button", { name: /clear email mapping/i }),
      );

      // Should not crash
      expect(screen.getByTestId("selected-node-id")).toHaveTextContent("none");
    });

    it("clears node mapping when node is selected", async () => {
      const user = userEvent.setup();
      const node = createMockNode("node-1", "Node 1", {
        email: {
          type: "string",
          is_metadata: false,
          component_key: "email",
          output_key: "email",
        },
      });
      const mockGraph = createMockApiResponse({ nodes: [node] });
      vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

      renderWithProvider();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /select node-1/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /select node-1/i }));

      // Verify email mapping exists
      expect(
        screen.getByTestId("selected-node-mappings").textContent,
      ).toContain("email");

      await user.click(
        screen.getByRole("button", { name: /clear email mapping/i }),
      );

      // The mapping should be removed
      await waitFor(() => {
        const mappingsText = screen.getByTestId(
          "selected-node-mappings",
        ).textContent;
        expect(mappingsText).not.toContain("email");
      });
    });
  });
});
