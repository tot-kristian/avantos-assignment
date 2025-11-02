import { DirectParentDataSource } from "./directParent";
import {
  createMockApiResponse,
  createMockForm,
  createMockNode,
} from "@/features/BlueprintGraph/test/utils/mockFactories";
import type { GraphEdge } from "@/features/BlueprintGraph/api/types/graphEdge.ts";

describe("DirectParentDataSource", () => {
  it("should have correct id and label", () => {
    expect(DirectParentDataSource.id).toBe("direct-parent");
    expect(DirectParentDataSource.label).toBe("Direct parent data");
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

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node1",
    });

    expect(result).toEqual([]);
  });

  it("should return fields from direct parent node", () => {
    const node1 = createMockNode("node1", "Parent Node");
    node1.data.component_id = "form1";
    node1.data.component_key = "parent_component";

    const node2 = createMockNode("node2", "Child Node");
    node2.data.component_id = "form2";

    const form1 = createMockForm({
      username: { type: "string", avantos_type: "short-text" },
      email: { type: "string", avantos_type: "short-text", format: "email" },
    });

    const edges = [
      {
        id: "edge1",
        source: "node1",
        target: "node2",
        type: "default" as const,
      },
    ];
    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node2",
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "direct:node1:username",
      group: "Parent Node",
      label: "username",
      valueType: "string",
      entry: {
        type: "form_field",
        component_key: "parent_component",
        output_key: "username",
        is_metadata: false,
      },
    });
    expect(result[1]).toEqual({
      id: "direct:node1:email",
      group: "Parent Node",
      label: "email",
      valueType: "string",
      entry: {
        type: "form_field",
        component_key: "parent_component",
        output_key: "email",
        is_metadata: false,
      },
    });
  });

  it("should return fields from multiple direct parent nodes", () => {
    const node1 = createMockNode("node1", "Parent 1");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent 2");
    node2.data.component_id = "form2";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Child Node");
    node3.data.component_id = "form3";

    const form1 = createMockForm(
      {
        field1: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        field2: { type: "array", avantos_type: "multi-select" },
      },
      "form2",
    );

    const edges = [
      {
        id: "edge1",
        source: "node1",
        target: "node3",
        type: "default" as const,
      },
      {
        id: "edge2",
        source: "node2",
        target: "node3",
        type: "default" as const,
      },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node3",
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "direct:node1:field1",
      group: "Parent 1",
      label: "field1",
      entry: {
        component_key: "component1",
        output_key: "field1",
      },
    });
    expect(result[1]).toMatchObject({
      id: "direct:node2:field2",
      group: "Parent 2",
      label: "field2",
      entry: {
        component_key: "component2",
        output_key: "field2",
      },
    });
  });

  it("should not include transitive parents, only direct ones", () => {
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

    const edges = [
      {
        id: "edge1",
        source: "node1",
        target: "node2",
        type: "default" as const,
      },
      {
        id: "edge2",
        source: "node2",
        target: "node3",
        type: "default" as const,
      },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node3",
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "direct:node2:parentField",
      group: "Parent",
      label: "parentField",
      entry: {
        component_key: "component2",
        output_key: "parentField",
      },
    });
    // Should not include grandparent field
    expect(result.find((r) => r.label === "grandparentField")).toBeUndefined();
  });

  it("should filter out parent nodes without forms", () => {
    const node1 = createMockNode("node1", "Parent with form");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Parent without form");
    node2.data.component_id = "nonexistent_form";
    node2.data.component_key = "component2";

    const node3 = createMockNode("node3", "Child");
    node3.data.component_id = "form3";

    const form1 = createMockForm(
      {
        field1: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const edges: GraphEdge[] = [
      {
        source: "node1",
        target: "node3",
      },
      {
        source: "node2",
        target: "node3",
      },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node3",
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "direct:node1:field1",
      group: "Parent with form",
      label: "field1",
    });
  });

  it("should handle parent with empty form properties", () => {
    const node1 = createMockNode("node1", "Parent");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Child");
    node2.data.component_id = "form2";

    const form1 = createMockForm({}, "form1");

    const edges: GraphEdge[] = [
      {
        source: "node1",
        target: "node2",
      },
    ];
    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node2",
    });

    expect(result).toEqual([]);
  });

  it("should map different field types correctly", () => {
    const node1 = createMockNode("node1", "Parent");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Child");
    node2.data.component_id = "form2";

    const form1 = createMockForm({
      stringField: { type: "string", avantos_type: "short-text" },
      arrayField: { type: "array", avantos_type: "multi-select" },
      objectField: { type: "object", avantos_type: "object-enum" },
    });

    const edges: GraphEdge[] = [
      {
        source: "node1",
        target: "node2",
      },
    ];
    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node2",
    });

    expect(result).toHaveLength(3);
    expect(result[0].valueType).toBe("string");
    expect(result[1].valueType).toBe("array");
    expect(result[2].valueType).toBe("object");
  });

  it("should generate unique IDs for each field", () => {
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
        sameField: { type: "string", avantos_type: "short-text" },
      },
      "form1",
    );

    const form2 = createMockForm(
      {
        sameField: { type: "string", avantos_type: "short-text" },
      },
      "form2",
    );

    const edges: GraphEdge[] = [
      {
        source: "node1",
        target: "node3",
      },
      {
        source: "node2",
        target: "node3",
      },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2, node3],
      edges,
      forms: [form1, form2],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node3",
    });

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("direct:node1:sameField");
    expect(result[1].id).toBe("direct:node2:sameField");
    expect(result[0].id).not.toBe(result[1].id);
  });

  it("should set entry type to form_field and is_metadata to false", () => {
    const node1 = createMockNode("node1", "Parent");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Child");

    const form1 = createMockForm({
      field1: { type: "string", avantos_type: "short-text" },
    });

    const edges: GraphEdge[] = [
      {
        source: "node1",
        target: "node2",
      },
    ];

    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node2",
    });

    expect(result[0].entry.type).toBe("form_field");
    expect(result[0].entry.is_metadata).toBe(false);
  });

  it("should use node name as group label", () => {
    const node1 = createMockNode("node1", "Custom Parent Name");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Child");

    const form1 = createMockForm({
      field1: { type: "string", avantos_type: "short-text" },
    });

    const edges: GraphEdge[] = [
      {
        source: "node1",
        target: "node2",
      },
    ];
    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node2",
    });

    expect(result[0].group).toBe("Custom Parent Name");
  });

  it("should use component_key from parent node in entry", () => {
    const node1 = createMockNode("node1", "Parent");
    node1.data.component_id = "form1";
    node1.data.component_key = "custom_component_key";

    const node2 = createMockNode("node2", "Child");

    const form1 = createMockForm({
      field1: { type: "string", avantos_type: "short-text" },
    });

    const edges: GraphEdge[] = [
      {
        source: "node1",
        target: "node2",
      },
    ];
    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node2",
    });

    expect(result[0].entry.component_key).toBe("custom_component_key");
  });

  it("should use field name as output_key in entry", () => {
    const node1 = createMockNode("node1", "Parent");
    node1.data.component_id = "form1";
    node1.data.component_key = "component1";

    const node2 = createMockNode("node2", "Child");

    const form1 = createMockForm({
      customFieldName: { type: "string", avantos_type: "short-text" },
    });

    const edges: GraphEdge[] = [
      {
        source: "node1",
        target: "node2",
      },
    ];
    const graph = createMockApiResponse({
      nodes: [node1, node2],
      edges,
      forms: [form1],
    });

    const result = DirectParentDataSource.listFor({
      graph,
      targetNodeId: "node2",
    });

    expect(result[0].entry.output_key).toBe("customFieldName");
  });
});
