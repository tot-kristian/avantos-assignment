import { getFormFieldsWithPrefill } from "./getFormFieldsWithPrefill.ts";
import type {
  ApiMappingEntry,
  GraphNode,
} from "@/features/BlueprintGraph/api/types";
import {
  createMockForm,
  createMockNode,
} from "@/features/BlueprintGraph/test/utils/mockFactories.ts";

describe("getFormFieldsWithPrefill", () => {
  it("should return empty array when form has no properties", () => {
    const node = createMockNode("node1", "Node 1");
    const form = createMockForm({});

    const result = getFormFieldsWithPrefill(node, form);

    expect(result).toEqual([]);
  });

  it("should return fields with hasMapper true when field is in input_mapping", () => {
    const node = createMockNode("node1", "Node 1", {
      username: {
        component_key: "parent_component",
        output_key: "user_name",
        type: "string",
        is_metadata: false,
      },
    });
    const form = createMockForm({
      username: {
        type: "string",
        avantos_type: "short-text",
      },
      email: {
        type: "string",
        format: "email",
        avantos_type: "short-text",
      },
    });

    const result = getFormFieldsWithPrefill(node, form);

    expect(result).toEqual([
      {
        key: "username",
        value: { type: "string", avantos_type: "short-text" },
        hasMapper: true,
      },
      {
        key: "email",
        value: { type: "string", format: "email", avantos_type: "short-text" },
        hasMapper: false,
      },
    ]);
  });

  it("should return hasMapper true for multiple mapped fields", () => {
    const node = createMockNode("node1", "Node 1", {
      username: {
        component_key: "parent_component",
        output_key: "user_name",
        type: "string",
        is_metadata: false,
      },
      email: {
        component_key: "parent_component",
        output_key: "user_email",
        type: "string",
        is_metadata: false,
      },
    });
    const form = createMockForm({
      username: {
        type: "string",
        avantos_type: "short-text",
      },
      email: {
        type: "string",
        format: "email",
        avantos_type: "short-text",
      },
      phone: {
        type: "string",
        avantos_type: "short-text",
      },
    });

    const result = getFormFieldsWithPrefill(node, form);

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ key: "username", hasMapper: true });
    expect(result[1]).toMatchObject({ key: "email", hasMapper: true });
    expect(result[2]).toMatchObject({ key: "phone", hasMapper: false });
  });

  it("should handle node with undefined input_mapping", () => {
    const node: GraphNode = {
      id: "node1",
      type: "action",
      position: { x: 0, y: 0 },
      data: {
        id: "unique-action-id",
        component_key: "component_1",
        input_mapping: undefined as unknown as Record<string, ApiMappingEntry>,
        component_type: "any",
        component_id: "form_id",
        name: "Test Node",
      },
    };
    const form = createMockForm({
      username: {
        type: "string",
        avantos_type: "short-text",
      },
    });

    const result = getFormFieldsWithPrefill(node, form);

    expect(result).toEqual([
      {
        key: "username",
        value: { type: "string", avantos_type: "short-text" },
        hasMapper: false,
      },
    ]);
  });

  it("should preserve field order from properties", () => {
    const node = createMockNode("node1", "Node 1");
    const form = createMockForm({
      first: {
        type: "string",
        avantos_type: "short-text",
      },
      second: {
        type: "string",
        avantos_type: "short-text",
      },
      third: {
        type: "string",
        avantos_type: "short-text",
      },
    });

    const result = getFormFieldsWithPrefill(node, form);

    expect(result[0].key).toBe("first");
    expect(result[1].key).toBe("second");
    expect(result[2].key).toBe("third");
  });
});
