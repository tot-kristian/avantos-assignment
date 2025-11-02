import { TransitiveParentDataSource } from "./transitiveParent";
import {
  createMockApiResponse,
  createMockForm,
  createMockNode,
} from "@/features/BlueprintGraph/test/utils/mockFactories";
import type { GraphEdge } from "@/features/BlueprintGraph/api/types/graphEdge";

describe("TransitiveParentDataSource", () => {
  it("should have correct id and label", () => {
    expect(TransitiveParentDataSource.id).toBe("transitive-parent");
    expect(TransitiveParentDataSource.label).toBe("Transitive parent data");
  });

  it("should return empty array when node has no parents", () => {
    const node1 = createMockNode("node1", "Node 1");
    node1.data.component_id = "form1";

    const form1 = createMockForm({
      username: { type: "string", avantos_type: "short-text" },
    });

    const graph = createMockApiResponse({
      nodes: [node1],
      edges: [],
      forms: [form1],
    });

    const result = TransitiveParentDataSource.listFor({
      graph,
      targetNodeId: "node1",
    });

    expect(result).toEqual([]);
  });

  it("should return empty array when node has only direct parents", () => {
    const node1 = createMockNode("node1", "Parent");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Child");
    node2.data.component_id = "form2";

    const form1 = createMockForm({
      field1: { type: "string", avantos_type: "short-text" },
    });

    const edges: GraphEdge[] = [{ source: "node1", target: "node2" }];

    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = TransitiveParentDataSource.listFor({
      graph,
      targetNodeId: "node2",
    });

    expect(result).toEqual([]);
  });

  it("should return fields from transitive parent in a chain", () => {
    const node1 = createMockNode("node1", "Grandparent");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Child");
    node3.data.component_id = "form3";

    const form1 = createMockForm(
      {
        username: { type: "string", avantos_type: "short-text" },
        email: { type: "string", avantos_type: "short-text", format: "email" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        parentField: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const edges: GraphEdge[] = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2],
    });

    const result = TransitiveParentDataSource.listFor({
      graph,
      targetNodeId: "node3",
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "transitive:node1:username",
      group: "Grandparent",
      label: "username",
      valueType: "string",
      entry: {
        type: "form_field",
        component_key: "component1",
        output_key: "username",
        is_metadata: false,
      },
    });
    expect(result[1]).toEqual({
      id: "transitive:node1:email",
      group: "Grandparent",
      label: "email",
      valueType: "string",
      entry: {
        type: "form_field",
        component_key: "component1",
        output_key: "email",
        is_metadata: false,
      },
    });
  });

  it("should not include direct parents, only transitive ones", () => {
    const node1 = createMockNode("node1", "Grandparent");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Child");
    node3.data.component_id = "form3";

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

    const edges: GraphEdge[] = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2],
    });

    const result = TransitiveParentDataSource.listFor({
      graph,
      targetNodeId: "node3",
    });

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("grandparentField");
    expect(result.find((r) => r.label === "parentField")).toBeUndefined();
  });

  it("should return fields from multiple transitive parents", () => {
    const node1 = createMockNode("node1", "Ancestor 1");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Ancestor 2");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Parent 1");
    node3.data.component_id = "form3";
    node3.data.component_key = "component3";

    const node4 = createMockNode("node4", "Parent 2");
    node4.data.component_id = "form4";
    node4.data.component_key = "component4";

    const node5 = createMockNode("node5", "Child");
    node5.data.component_id = "form5";

    const form1 = createMockForm(
      {
        ancestor1Field: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        ancestor2Field: { type: "array", avantos_type: "multi-select" },
      },
      "form2",
    );

    const form3 = createMockForm(
      {
        parent1Field: { type: "string", avantos_type: "short-text" },
      },
      "form3",
    );

    const form4 = createMockForm(
      {
        parent2Field: { type: "string", avantos_type: "short-text" },
      },
      "form4",
    );

    const edges: GraphEdge[] = [
      { source: "node1", target: "node3" },
      { source: "node2", target: "node4" },
      { source: "node3", target: "node5" },
      { source: "node4", target: "node5" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3, node4, node5],
      edges,
      forms: [form1, form2, form3, form4],
    });

    const result = TransitiveParentDataSource.listFor({
      graph,
      targetNodeId: "node5",
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "transitive:node1:ancestor1Field",
      group: "Ancestor 1",
      label: "ancestor1Field",
      valueType: "string",
      entry: {
        component_key: "component1",
        output_key: "ancestor1Field",
      },
    });
    expect(result[1]).toMatchObject({
      id: "transitive:node2:ancestor2Field",
      group: "Ancestor 2",
      label: "ancestor2Field",
      valueType: "array",
      entry: {
        component_key: "component2",
        output_key: "ancestor2Field",
      },
    });
  });

  it("should filter out transitive parent nodes without forms", () => {
    const node1 = createMockNode("node1", "Ancestor with form");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Ancestor without form");
    node3.data.component_id = "nonexistent_form";
    node3.data.component_key = "component3";

    const node4 = createMockNode("node4", "Parent 2");
    node4.data.component_id = "form4";
    node4.data.component_key = "component4";

    const node5 = createMockNode("node5", "Child");
    node5.data.component_id = "form5";

    const form1 = createMockForm(
      {
        field1: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        parentField: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const form4 = createMockForm(
      {
        parent2Field: { type: "string", avantos_type: "short-text" },
      },
      "form4",
    );

    const edges: GraphEdge[] = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node5" },
      { source: "node3", target: "node4" },
      { source: "node4", target: "node5" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3, node4, node5],
      edges,
      forms: [form1, form2, form4],
    });

    const result = TransitiveParentDataSource.listFor({
      graph,
      targetNodeId: "node5",
    });

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("field1");
    expect(result[0].group).toBe("Ancestor with form");
  });

  it("should handle transitive parent with empty form properties", () => {
    const node1 = createMockNode("node1", "Ancestor");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Child");
    node3.data.component_id = "form3";

    const form1 = createMockForm({}, "form1");
    const form2 = createMockForm(
      {
        parentField: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const edges: GraphEdge[] = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2],
    });

    const result = TransitiveParentDataSource.listFor({
      graph,
      targetNodeId: "node3",
    });

    expect(result).toEqual([]);
  });

  it("should correctly map different field types from transitive parents", () => {
    const node1 = createMockNode("node1", "Ancestor");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Child");
    node3.data.component_id = "form3";

    const form1 = createMockForm({
      stringField: { type: "string", avantos_type: "short-text" },
      arrayField: { type: "array", avantos_type: "multi-select" },
      objectField: { type: "object", avantos_type: "object-enum" },
    });

    const form2 = createMockForm({
      parentField: { type: "string", avantos_type: "short-text" },
    });

    const edges: GraphEdge[] = [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2],
    });

    const result = TransitiveParentDataSource.listFor({
      graph,
      targetNodeId: "node3",
    });

    expect(result).toHaveLength(3);
    expect(result[0].valueType).toBe("string");
    expect(result[1].valueType).toBe("array");
    expect(result[2].valueType).toBe("object");
  });
});
