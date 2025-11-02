import { getAllDataSources } from "./getAllDataSources";
import {
  createMockApiResponse,
  createMockForm,
  createMockNode,
} from "@/features/BlueprintGraph/test/utils/mockFactories";
import type { GraphEdge } from "@/features/BlueprintGraph/api/types/graphEdge";

describe("getAllDataSources", () => {
  it("should return only global data sources when graph has no data", () => {
    const node1 = createMockNode("node1", "Node 1");
    const graph = createMockApiResponse({
      nodes: [node1],
      edges: [],
      forms: [],
    });

    const result = getAllDataSources(graph, "node1");

    expect(Object.keys(result)).toEqual([
      "Action Properties",
      "Client Organization",
    ]);
  });

  it("should group items by their group property", () => {
    const node1 = createMockNode("node1", "Parent Node");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Child Node");
    node2.data.component_id = "form2";

    const form1 = createMockForm({
      field1: { type: "string", avantos_type: "short-text" },
      field2: { type: "string", avantos_type: "short-text" },
    });

    const edges: GraphEdge[] = [{ source: "node1", target: "node2" }];

    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = getAllDataSources(graph, "node2");

    expect(result).toHaveProperty("Parent Node");
    expect(result["Parent Node"]).toHaveLength(2);
    expect(result["Parent Node"][0].group).toBe("Parent Node");
    expect(result["Parent Node"][1].group).toBe("Parent Node");
  });

  it("should group items from multiple parents into separate groups", () => {
    const node1 = createMockNode("node1", "Parent 1");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent 2");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Child");
    node3.data.component_id = "form3";

    const form1 = createMockForm(
      {
        field1: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        field2: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const edges: GraphEdge[] = [
      { source: "node1", target: "node3" },
      { source: "node2", target: "node3" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2],
    });

    const result = getAllDataSources(graph, "node3");

    expect(result).toHaveProperty("Parent 1");
    expect(result).toHaveProperty("Parent 2");
    expect(result["Parent 1"]).toHaveLength(1);
    expect(result["Parent 2"]).toHaveLength(1);
    expect(result["Parent 1"][0].label).toBe("field1");
    expect(result["Parent 2"][0].label).toBe("field2");
  });

  it("should combine direct and transitive parents from same node into one group", () => {
    const node1 = createMockNode("node1", "Ancestor");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Child");
    node3.data.component_id = "form3";

    const node4 = createMockNode("node4", "GrandChild");
    node4.data.component_id = "form4";

    const form1 = createMockForm(
      {
        ancestorField: { type: "string", avantos_type: "short-text" },
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
      { source: "node3", target: "node4" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3, node4],
      edges,
      forms: [form1, form2, form3],
    });

    const result = getAllDataSources(graph, "node4");

    // Node3 (Child) is direct parent - should have its own group
    expect(result).toHaveProperty("Child");
    expect(result["Child"]).toHaveLength(1);
    expect(result["Child"][0].label).toBe("childField");

    // Node2 and Node1 are transitive parents
    expect(result).toHaveProperty("Parent");
    expect(result["Parent"]).toHaveLength(1);
    expect(result["Parent"][0].label).toBe("parentField");

    expect(result).toHaveProperty("Ancestor");
    expect(result["Ancestor"]).toHaveLength(1);
    expect(result["Ancestor"][0].label).toBe("ancestorField");
  });

  it("should group all items with same group name together", () => {
    const node1 = createMockNode("node1", "Same Name");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Same Name");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Parent");
    node3.data.component_id = "form3";
    node3.data.component_key = "component3";

    const node4 = createMockNode("node4", "Child");
    node4.data.component_id = "form4";

    const form1 = createMockForm(
      {
        field1: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        field2: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const form3 = createMockForm(
      {
        parentField: { type: "string", avantos_type: "short-text" },
      },
      "form3",
    );

    const edges: GraphEdge[] = [
      { source: "node1", target: "node3" },
      { source: "node2", target: "node3" },
      { source: "node3", target: "node4" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3, node4],
      edges,
      forms: [form1, form2, form3],
    });

    const result = getAllDataSources(graph, "node4");

    // Both transitive parents have "Same Name" - should be grouped together
    expect(result).toHaveProperty("Same Name");
    expect(result["Same Name"]).toHaveLength(2);
    expect(result["Same Name"].map((item) => item.label)).toContain("field1");
    expect(result["Same Name"].map((item) => item.label)).toContain("field2");
  });

  it("should preserve order of items within each group", () => {
    const node1 = createMockNode("node1", "Parent");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Child");
    node2.data.component_id = "form2";

    const form1 = createMockForm({
      fieldA: { type: "string", avantos_type: "short-text" },
      fieldB: { type: "string", avantos_type: "short-text" },
      fieldC: { type: "string", avantos_type: "short-text" },
    });

    const edges: GraphEdge[] = [{ source: "node1", target: "node2" }];

    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = getAllDataSources(graph, "node2");

    expect(result["Parent"]).toHaveLength(3);
    expect(result["Parent"][0].label).toBe("fieldA");
    expect(result["Parent"][1].label).toBe("fieldB");
    expect(result["Parent"][2].label).toBe("fieldC");
  });
});
