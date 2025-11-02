import { describe, expect, it } from "vitest";
import { getDirectParentNodes } from "./getDirectParentNodes";
import {
  createMockGraph,
  createMockNode,
} from "@/features/BlueprintGraph/test/utils/mockFactories.ts";

describe("getDirectParentNodes", () => {
  it("should return an empty array when node has no parents", () => {
    const nodes = [createMockNode("node1", "Node 1")];
    const graph = createMockGraph(nodes, []);

    const result = getDirectParentNodes(graph, "node1");

    expect(result).toEqual([]);
  });

  it("should return single direct parent", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const nodes = [node1, node2];
    const edges = [{ source: "node1", target: "node2" }];
    const graph = createMockGraph(nodes, edges);

    const result = getDirectParentNodes(graph, "node2");

    expect(result).toEqual([node1]);
  });

  it("should return multiple direct parents", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const nodes = [node1, node2, node3];
    const edges = [
      { source: "node1", target: "node3" },
      { source: "node2", target: "node3" },
    ];
    const graph = createMockGraph(nodes, edges);

    const result = getDirectParentNodes(graph, "node3");

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(node1);
    expect(result).toContainEqual(node2);
  });

  it("should return only direct parents, not transitive parents", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const nodes = [node1, node2, node3];
    const edges = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
    ];
    const graph = createMockGraph(nodes, edges);

    const result = getDirectParentNodes(graph, "node3");

    expect(result).toEqual([node2]);
    expect(result).not.toContainEqual(node1);
  });

  it("should handle a node that does not exist in the graph", () => {
    const nodes = [createMockNode("node1", "Node 1")];
    const graph = createMockGraph(nodes, []);

    const result = getDirectParentNodes(graph, "nonexistent");

    expect(result).toEqual([]);
  });

  it("should handle empty graph", () => {
    const graph = createMockGraph([], []);

    const result = getDirectParentNodes(graph, "node1");

    expect(result).toEqual([]);
  });

  it("should handle complex graph with multiple branches", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const node4 = createMockNode("node4", "Node 4");
    const node5 = createMockNode("node5", "Node 5");
    const nodes = [node1, node2, node3, node4, node5];
    const edges = [
      { source: "node1", target: "node2" },
      { source: "node1", target: "node3" },
      { source: "node2", target: "node4" },
      { source: "node3", target: "node4" },
      { source: "node4", target: "node5" },
    ];
    const graph = createMockGraph(nodes, edges);

    const result = getDirectParentNodes(graph, "node4");

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(node2);
    expect(result).toContainEqual(node3);
  });

  it("should handle diamond pattern graph", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const node4 = createMockNode("node4", "Node 4");
    const nodes = [node1, node2, node3, node4];
    const edges = [
      { source: "node1", target: "node2" },
      { source: "node1", target: "node3" },
      { source: "node2", target: "node4" },
      { source: "node3", target: "node4" },
    ];
    const graph = createMockGraph(nodes, edges);

    const result = getDirectParentNodes(graph, "node4");

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(node2);
    expect(result).toContainEqual(node3);
  });

  it("should handle node with self-loop", () => {
    const node1 = createMockNode("node1", "Node 1");
    const nodes = [node1];
    const edges = [{ source: "node1", target: "node1" }];
    const graph = createMockGraph(nodes, edges);

    const result = getDirectParentNodes(graph, "node1");

    expect(result).toEqual([node1]);
  });

  it("should handle node that is both a parent and child in different relationships", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const nodes = [node1, node2, node3];
    const edges = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
    ];
    const graph = createMockGraph(nodes, edges);

    const resultForNode2 = getDirectParentNodes(graph, "node2");
    const resultForNode3 = getDirectParentNodes(graph, "node3");

    expect(resultForNode2).toEqual([node1]);
    expect(resultForNode3).toEqual([node2]);
  });

  it("should handle edges pointing to same target from same source multiple times", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const nodes = [node1, node2];
    const graph = createMockGraph(nodes, [
      { source: "node1", target: "node2" },
      { source: "node1", target: "node2" },
    ]);

    const result = getDirectParentNodes(graph, "node2");

    expect(result).toEqual([node1]);
  });
});
