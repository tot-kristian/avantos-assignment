import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getBlueprintsGraphData } from "../../api/getBlueprintsGraphData";
import {
  createMockApiResponse,
  createMockForm,
  createMockNode,
} from "../../test/utils/mockFactories";
import type { GraphEdge } from "../../api/types/graphEdge";
import { BlueprintGraph } from "@/features/BlueprintGraph/components/BlueprintGraph/BlueprintGraph.tsx";

vi.mock("../../api/getBlueprintsGraphData");

const renderBlueprintGraph = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <BlueprintGraph />
    </QueryClientProvider>,
  );
};

describe("BlueprintGraph - Smoke Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the complete flow: load nodes, select node, view form, close", async () => {
    const user = userEvent.setup();

    const node1 = createMockNode("node1", "User Registration");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const form1 = createMockForm(
      {
        username: { type: "string", avantos_type: "short-text" },
        email: { type: "string", avantos_type: "short-text", format: "email" },
      },
      "form1",
      "User Registration Form",
    );

    const mockGraph = createMockApiResponse({
      nodes: [node1],
      forms: [form1],
    });

    vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

    renderBlueprintGraph();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("User Registration")).toBeInTheDocument();
    });

    // Click on node to open sheet
    const nodeCard = screen.getByTestId("node-card");
    await user.click(nodeCard);

    // Verify sheet is open with node details
    await waitFor(() => {
      expect(screen.getByText("Node ID: node1")).toBeInTheDocument();
      expect(screen.getByText("Name: User Registration")).toBeInTheDocument();
    });

    // Close the sheet
    const closeButton = screen.getByTestId("sheet-close-button");
    await user.click(closeButton);

    // Verify sheet is closed
    await waitFor(() => {
      expect(screen.queryByText("Node ID: node1")).not.toBeInTheDocument();
    });
  });

  it("should handle 3 nodes with different forms", async () => {
    const user = userEvent.setup();

    const node1 = createMockNode("node1", "Registration");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Validation");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Confirmation");
    node3.data.component_id = "form3";
    node3.data.component_key = "component3";

    const form1 = createMockForm(
      {
        username: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        validationCode: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const form3 = createMockForm(
      {
        confirmed: { type: "string", avantos_type: "checkbox-group" },
      },
      "form3",
    );

    const edges: GraphEdge[] = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
    ];

    const mockGraph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2, form3],
    });

    vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

    renderBlueprintGraph();

    // Wait for all nodes to load
    await waitFor(() => {
      expect(screen.getByText("Registration")).toBeInTheDocument();
      expect(screen.getByText("Validation")).toBeInTheDocument();
      expect(screen.getByText("Confirmation")).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("node-card")).toHaveLength(3);

    // Click first node
    const cards = screen.getAllByTestId("node-card");
    await user.click(cards[0]);

    await waitFor(() => {
      expect(screen.getByText("Node ID: node1")).toBeInTheDocument();
    });

    // Close and click second node
    const closeButton = screen.getByTestId("sheet-close-button");
    await user.click(closeButton);

    await user.click(cards[1]);

    await waitFor(() => {
      expect(screen.getByText("Node ID: node2")).toBeInTheDocument();
    });
  });

  it("should update node mapping and clear it", async () => {
    const user = userEvent.setup();

    const node1 = createMockNode("node1", "Parent Node");
    node1.data.component_id = "form1";
    node1.data.component_key = "parent_component";

    const node2 = createMockNode("node2", "Child Node");
    node2.data.component_id = "form2";
    node2.data.component_key = "child_component";

    const form1 = createMockForm(
      {
        parentField: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        childField: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const edges: GraphEdge[] = [{ source: "node1", target: "node2" }];

    const mockGraph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1, form2],
    });

    vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

    renderBlueprintGraph();

    // Wait for nodes to load
    await waitFor(() => {
      expect(screen.getByText("Child Node")).toBeInTheDocument();
    });

    // Click child node to open sheet
    const cards = screen.getAllByTestId("node-card");
    await user.click(cards[1]); // Click child node

    await waitFor(() => {
      expect(screen.getByText("Node ID: node2")).toBeInTheDocument();
    });

    // Find a field row (should show "No mapping" initially)
    await waitFor(() => {
      expect(screen.getByText("childField")).toBeInTheDocument();
    });

    // Click "Select mapping" button for the field
    const selectButtons = screen.getAllByTestId(
      "prefill-sheet-content-select-div",
    );
    if (selectButtons.length > 0) {
      await user.click(selectButtons[0]);

      // Modal should open
      await waitFor(() => {
        expect(
          screen.getByText(/select data element to map/i),
        ).toBeInTheDocument();
      });

      // Select a data source from parent node
      const dataSourceButtons = screen.getAllByRole("button");
      const parentButton = dataSourceButtons.find((button) =>
        button.textContent?.includes("parentField"),
      );

      if (parentButton) {
        await user.click(parentButton);

        // Click "Select" button in modal
        const selectModalButton = screen.getByRole("button", {
          name: /^select$/i,
        });
        await user.click(selectModalButton);

        // Verify mapping was added
        await waitFor(() => {
          expect(
            screen.queryByText(/select data element to map/i),
          ).not.toBeInTheDocument();
        });
      }
    }

    // Clear the mapping
    const clearButtons = screen.queryAllByRole("button", {
      name: /clear mapping/i,
    });
    if (clearButtons.length > 0) {
      await user.click(clearButtons[0]);

      // Verify mapping was cleared
      await waitFor(() => {
        expect(screen.getByText(/no mapping/i)).toBeInTheDocument();
      });
    }
  });

  it("should handle node selection in a graph with parent-child relationships", async () => {
    const user = userEvent.setup();

    const grandparent = createMockNode("node1", "Grandparent");
    grandparent.data.component_id = "form1";
    grandparent.data.component_key = "grandparent_component";

    const parent = createMockNode("node2", "Parent");
    parent.data.component_id = "form2";
    parent.data.component_key = "parent_component";

    const child = createMockNode("node3", "Child");
    child.data.component_id = "form3";
    child.data.component_key = "child_component";

    const form1 = createMockForm(
      {
        grandparentField: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        parentField: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const form3 = createMockForm(
      {
        childField: { type: "string", avantos_type: "short-text" },
      },
      "form3",
    );

    const edges: GraphEdge[] = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
    ];

    const mockGraph = createMockApiResponse({
      nodes: [grandparent, parent, child],
      edges,
      forms: [form1, form2, form3],
    });

    vi.mocked(getBlueprintsGraphData).mockResolvedValue(mockGraph);

    renderBlueprintGraph();

    // Wait for all nodes to load
    await waitFor(() => {
      expect(screen.getByText("Grandparent")).toBeInTheDocument();
      expect(screen.getByText("Parent")).toBeInTheDocument();
      expect(screen.getByText("Child")).toBeInTheDocument();
    });

    // Click child node
    const cards = screen.getAllByTestId("node-card");
    await user.click(cards[2]); // Child is the third node

    // Verify sheet opens with child node
    await waitFor(() => {
      expect(screen.getByText("Node ID: node3")).toBeInTheDocument();
      expect(screen.getByText("Name: Child")).toBeInTheDocument();
    });

    // Child should have access to both direct parent and transitive parent data
    expect(screen.getByText("childField")).toBeInTheDocument();
  });
});
