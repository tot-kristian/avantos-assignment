import { updateNodeInputMapping } from "./updateNodeInputMapping.ts";
import {
  createMockGraph,
  createMockNode,
} from "@/features/BlueprintGraph/test/utils/mockFactories";
import type {
  ActionBlueprintGraphResponse,
  ApiMappingEntry,
} from "@/features/BlueprintGraph/api/types";

describe("updateNodeInputMapping", () => {
  const mockEntry: ApiMappingEntry = {
    component_key: "parent_component",
    output_key: "parent_field",
    type: "string",
    is_metadata: false,
  };

  it("should add mapping to node when entry is provided", () => {
    const node1 = createMockNode("node1", "Node 1");
    const graph = createMockGraph([node1], []) as ActionBlueprintGraphResponse;

    const result = updateNodeInputMapping({
      graphData: graph,
      nodeId: "node1",
      selectedField: "username",
      entry: mockEntry,
    });

    expect(result.nodes[0].data.input_mapping).toEqual({
      username: mockEntry,
    });
  });

  it("should update existing mapping for a field", () => {
    const node1 = createMockNode("node1", "Node 1", {
      username: {
        component_key: "old_component",
        output_key: "old_field",
        type: "string",
        is_metadata: false,
      },
    });
    const graph = createMockGraph([node1], []) as ActionBlueprintGraphResponse;

    const newEntry: ApiMappingEntry = {
      component_key: "new_component",
      output_key: "new_field",
      type: "string",
      is_metadata: false,
    };

    const result = updateNodeInputMapping({
      graphData: graph,
      nodeId: "node1",
      selectedField: "username",
      entry: newEntry,
    });

    expect(result.nodes[0].data.input_mapping.username).toEqual(newEntry);
  });

  it("should delete mapping when entry is null", () => {
    const node1 = createMockNode("node1", "Node 1", {
      username: mockEntry,
      email: {
        component_key: "comp2",
        output_key: "email_field",
        type: "string",
        is_metadata: false,
      },
    });
    const graph = createMockGraph([node1], []) as ActionBlueprintGraphResponse;

    const result = updateNodeInputMapping({
      graphData: graph,
      nodeId: "node1",
      selectedField: "username",
      entry: null,
    });

    expect(result.nodes[0].data.input_mapping.username).toBeUndefined();
    expect(result.nodes[0].data.input_mapping.email).toBeDefined();
  });

  it("should delete mapping when entry is undefined", () => {
    const node1 = createMockNode("node1", "Node 1", {
      username: mockEntry,
    });
    const graph = createMockGraph([node1], []) as ActionBlueprintGraphResponse;

    const result = updateNodeInputMapping({
      graphData: graph,
      nodeId: "node1",
      selectedField: "username",
      entry: undefined,
    });

    expect(result.nodes[0].data.input_mapping.username).toBeUndefined();
  });

  it("should return original graph when nodeId does not exist", () => {
    const node1 = createMockNode("node1", "Node 1");
    const graph = createMockGraph([node1], []) as ActionBlueprintGraphResponse;

    const result = updateNodeInputMapping({
      graphData: graph,
      nodeId: "nonexistent",
      selectedField: "username",
      entry: mockEntry,
    });

    expect(result).toBe(graph);
  });

  it("should not mutate original graph", () => {
    const node1 = createMockNode("node1", "Node 1");
    const graph = createMockGraph([node1], []) as ActionBlueprintGraphResponse;
    const originalInputMapping = { ...node1.data.input_mapping };

    updateNodeInputMapping({
      graphData: graph,
      nodeId: "node1",
      selectedField: "username",
      entry: mockEntry,
    });

    expect(graph.nodes[0].data.input_mapping).toEqual(originalInputMapping);
  });

  it("should only update the specified node in a graph with multiple nodes", () => {
    const node1 = createMockNode("node1", "Node 1", {
      username: {
        component_key: "old",
        output_key: "old",
        type: "string",
        is_metadata: false,
      },
    });
    const node2 = createMockNode("node2", "Node 2", {
      email: {
        component_key: "comp",
        output_key: "email",
        type: "string",
        is_metadata: false,
      },
    });
    const graph = createMockGraph(
      [node1, node2],
      [],
    ) as ActionBlueprintGraphResponse;

    const result = updateNodeInputMapping({
      graphData: graph,
      nodeId: "node1",
      selectedField: "username",
      entry: mockEntry,
    });

    expect(result.nodes[0].data.input_mapping.username).toEqual(mockEntry);
    expect(result.nodes[1].data.input_mapping.email).toEqual({
      component_key: "comp",
      output_key: "email",
      type: "string",
      is_metadata: false,
    });
  });

  it("should preserve other node properties when updating mapping", () => {
    const node1 = createMockNode("node1", "Node 1");
    const originalPosition = { ...node1.position };
    const originalComponentKey = node1.data.component_key;
    const graph = createMockGraph([node1], []) as ActionBlueprintGraphResponse;

    const result = updateNodeInputMapping({
      graphData: graph,
      nodeId: "node1",
      selectedField: "username",
      entry: mockEntry,
    });

    expect(result.nodes[0].position).toEqual(originalPosition);
    expect(result.nodes[0].data.component_key).toBe(originalComponentKey);
  });
});
