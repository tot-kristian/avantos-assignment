import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrefillModal } from "./PrefillModal";
import { useGraph } from "../../hooks/useGraph";
import {
  createMockApiResponse,
  createMockForm,
  createMockNode,
} from "../../test/utils/mockFactories";

vi.mock("../../hooks/useGraph");

describe("PrefillModal", () => {
  const mockSetModalOpen = vi.fn();
  const mockUpdateNodeMapping = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when open is false", () => {
    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({}),
      selectedNode: null,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={false}
        setModalOpen={mockSetModalOpen}
        selectedField={null}
      />,
    );

    expect(screen.queryByTestId("prefill-modal")).not.toBeInTheDocument();
  });

  it("should render modal when open is true", () => {
    const node = createMockNode("node1", "Test Node");
    node.data.component_id = "form1";

    const form = createMockForm(
      {
        username: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node], forms: [form] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="username"
      />,
    );

    expect(screen.getByText("Select data element to map")).toBeInTheDocument();
  });

  it("should display modal title", () => {
    const node = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="username"
      />,
    );

    expect(screen.getByText("Select data element to map")).toBeInTheDocument();
  });

  it("should display modal description", () => {
    const node = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="username"
      />,
    );

    expect(
      screen.getByText("Select elements from the lists below"),
    ).toBeInTheDocument();
  });

  it("should render Cancel button", () => {
    const node = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="username"
      />,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should render Select button", () => {
    const node = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="username"
      />,
    );

    expect(
      screen.getByRole("button", { name: /^select$/i }),
    ).toBeInTheDocument();
  });

  it("should call setModalOpen with false when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const node = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="username"
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("should disable Select button when no item is selected", () => {
    const node = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField={null}
      />,
    );

    const selectButton = screen.getByRole("button", { name: /^select$/i });
    expect(selectButton).toBeDisabled();
  });

  it("should render DataSourceList", () => {
    const node = createMockNode("node1", "Test Node");
    node.data.component_id = "form1";

    const form = createMockForm(
      {
        username: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node], forms: [form] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="username"
      />,
    );

    expect(screen.getByText("Available data")).toBeInTheDocument();
  });

  it("should render DataSourceDetails section", () => {
    const node = createMockNode("node1", "Test Node");

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({ nodes: [node] }),
      selectedNode: node,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="username"
      />,
    );

    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("should show data sources from parent nodes", async () => {
    const parentNode = createMockNode("parent", "Parent Node");
    parentNode.data.component_id = "form1";
    parentNode.data.component_key = "parent_component";

    const childNode = createMockNode("child", "Child Node");
    childNode.data.component_id = "form2";

    const form1 = createMockForm(
      {
        parentField: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const edges = [{ source: "parent", target: "child" }];

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({
        nodes: [parentNode, childNode],
        edges,
        forms: [form1],
      }),
      selectedNode: childNode,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="childField"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Parent Node")).toBeInTheDocument();
    });
  });

  it("should call updateNodeMapping when item is selected and Select is clicked", async () => {
    const user = userEvent.setup();
    const parentNode = createMockNode("parent", "Parent Node");
    parentNode.data.component_id = "form1";
    parentNode.data.component_key = "parent_component";

    const childNode = createMockNode("child", "Child Node");
    childNode.data.component_id = "form2";

    const form1 = createMockForm(
      {
        parentField: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const edges = [{ source: "parent", target: "child" }];

    vi.mocked(useGraph).mockReturnValue({
      graphData: createMockApiResponse({
        nodes: [parentNode, childNode],
        edges,
        forms: [form1],
      }),
      selectedNode: childNode,
      setSelectedNode: vi.fn(),
      updateNodeMapping: mockUpdateNodeMapping,
      clearNode: vi.fn(),
      isLoading: false,
    });

    render(
      <PrefillModal
        open={true}
        setModalOpen={mockSetModalOpen}
        selectedField="childField"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getAllByTestId("data-source-list-group").length,
      ).toBeGreaterThan(0);
    });

    const dataSourceButton = screen.getAllByTestId(
      "data-source-list-group",
    )?.[2];
    await user.click(dataSourceButton);

    const fieldButton = screen.getByTestId("data-source-list-label");
    await user.click(fieldButton);

    const selectButton = screen.getByRole("button", { name: /^select$/i });
    await user.click(selectButton);

    expect(mockUpdateNodeMapping).toHaveBeenCalled();
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });
});
