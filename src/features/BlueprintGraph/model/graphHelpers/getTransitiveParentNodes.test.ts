import { getTransitiveParentNodes } from "./getTransitiveParentNodes";
import {
  createMockGraph,
  createMockNode,
} from "@/features/BlueprintGraph/test/utils/mockFactories.ts";

describe("getTransitiveParentNodes", () => {
  it("should return empty array when node has no parents", () => {
    const node1 = createMockNode("node1", "Node 1");
    const graph = createMockGraph([node1], []);

    const result = getTransitiveParentNodes(graph, "node1");

    expect(result).toEqual([]);
  });

  it("should return empty array when node has only direct parents", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const graph = createMockGraph(
      [node1, node2],
      [{ source: "node1", target: "node2" }],
    );

    const result = getTransitiveParentNodes(graph, "node2");

    expect(result).toEqual([]);
  });

  it("should handle empty graph", () => {
    const graph = createMockGraph([], []);

    const result = getTransitiveParentNodes(graph, "node1");

    expect(result).toEqual([]);
  });

  it("should handle node that does not exist in graph", () => {
    const node1 = createMockNode("node1", "Node 1");
    const graph = createMockGraph([node1], []);

    const result = getTransitiveParentNodes(graph, "nonexistent");

    expect(result).toEqual([]);
  });

  it("should handle complex branching graph", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const node4 = createMockNode("node4", "Node 4");
    const node5 = createMockNode("node5", "Node 5");
    const node6 = createMockNode("node6", "Node 6");
    const graph = createMockGraph(
      [node1, node2, node3, node4, node5, node6],
      [
        { source: "node1", target: "node2" },
        { source: "node1", target: "node3" },
        { source: "node2", target: "node4" },
        { source: "node3", target: "node5" },
        { source: "node4", target: "node6" },
        { source: "node5", target: "node6" },
      ],
    );

    const result = getTransitiveParentNodes(graph, "node6");

    expect(result).toHaveLength(3);
    expect(result).toContainEqual(node1);
    expect(result).toContainEqual(node2);
    expect(result).toContainEqual(node3);
    expect(result).not.toContainEqual(node4); // direct parent
    expect(result).not.toContainEqual(node5); // direct parent
  });

  it("should handle multiple paths to same transitive parent", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const node4 = createMockNode("node4", "Node 4");
    const node5 = createMockNode("node5", "Node 5");
    const graph = createMockGraph(
      [node1, node2, node3, node4, node5],
      [
        { source: "node1", target: "node2" },
        { source: "node1", target: "node3" },
        { source: "node2", target: "node4" },
        { source: "node3", target: "node4" },
        { source: "node4", target: "node5" },
      ],
    );

    const result = getTransitiveParentNodes(graph, "node5");

    expect(result).toHaveLength(3);
    expect(result).toContainEqual(node1);
    expect(result).toContainEqual(node2);
    expect(result).toContainEqual(node3);
    // Should not contain duplicates
    const ids = result.map((n) => n.id);
    expect(ids).toEqual([...new Set(ids)]);
  });

  it("should handle deep chain of nodes", () => {
    const nodes = Array.from({ length: 10 }, (_, i) =>
      createMockNode(`node${i + 1}`, `Node ${i + 1}`),
    );
    const edges = Array.from({ length: 9 }, (_, i) => ({
      source: `node${i + 1}`,
      target: `node${i + 2}`,
    }));
    const graph = createMockGraph(nodes, edges);

    const result = getTransitiveParentNodes(graph, "node10");

    // All nodes except node10 itself and its direct parent (node9) should be transitive parents
    expect(result).toHaveLength(8);
    expect(result.map((n) => n.id)).not.toContain("node9"); // direct parent
    expect(result.map((n) => n.id)).not.toContain("node10"); // target node
    expect(result.map((n) => n.id)).toContain("node1");
    expect(result.map((n) => n.id)).toContain("node8");
  });

  it("should not include self in transitive parents for self-loop", () => {
    const node1 = createMockNode("node1", "Node 1");
    const graph = createMockGraph(
      [node1],
      [{ source: "node1", target: "node1" }],
    );

    const result = getTransitiveParentNodes(graph, "node1");

    expect(result).toEqual([]);
  });

  it("should handle root node in a tree", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const graph = createMockGraph(
      [node1, node2, node3],
      [
        { source: "node1", target: "node2" },
        { source: "node2", target: "node3" },
      ],
    );

    const result = getTransitiveParentNodes(graph, "node1");

    expect(result).toEqual([]);
  });

  it("should handle disconnected graph components", () => {
    const node1 = createMockNode("node1", "Node 1");
    const node2 = createMockNode("node2", "Node 2");
    const node3 = createMockNode("node3", "Node 3");
    const node4 = createMockNode("node4", "Node 4");
    const graph = createMockGraph(
      [node1, node2, node3, node4],
      [
        { source: "node1", target: "node2" },
        { source: "node3", target: "node4" },
      ],
    );

    const result = getTransitiveParentNodes(graph, "node2");

    expect(result).toEqual([]);
    expect(result).not.toContainEqual(node3);
    expect(result).not.toContainEqual(node4);
  });
});
