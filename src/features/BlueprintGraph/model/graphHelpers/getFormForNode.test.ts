import { describe, expect, it } from "vitest";
import { getFormForNode } from "./getFormForNode";
import {
  createMockForm,
  createMockGraph,
} from "@/features/BlueprintGraph/test/utils/mockFactories.ts";

describe("getFormForNode", () => {
  it("should return undefined when nodeId is undefined", () => {
    const graph = createMockGraph(
      [],
      [],
      [createMockForm({}, "form1", "Form 1")],
    );

    const result = getFormForNode(graph, undefined);

    expect(result).toBeUndefined();
  });

  it("should return undefined when nodeId is null", () => {
    const graph = createMockGraph(
      [],
      [],
      [createMockForm({}, "form1", "Form 1")],
    );

    const result = getFormForNode(graph, undefined);

    expect(result).toBeUndefined();
  });

  it("should return undefined when nodeId is empty string", () => {
    const graph = createMockGraph(
      [],
      [],
      [createMockForm({}, "form1", "Form 1")],
    );

    const result = getFormForNode(graph, "");

    expect(result).toBeUndefined();
  });

  it("should return the form when nodeId matches form id", () => {
    const form1 = createMockForm({}, "form1", "Form 1");
    const graph = createMockGraph([], [], [form1]);

    const result = getFormForNode(graph, "form1");

    expect(result).toEqual(form1);
  });

  it("should return the correct form when multiple forms exist", () => {
    const form1 = createMockForm({}, "form1", "Form 1");
    const form2 = createMockForm({}, "form2", "Form 2");
    const form3 = createMockForm({}, "form3", "Form 3");
    const graph = createMockGraph([], [], [form1, form2, form3]);

    const result = getFormForNode(graph, "form2");

    expect(result).toEqual(form2);
  });

  it("should return undefined when nodeId does not match any form", () => {
    const form1 = createMockForm({}, "form1", "Form 1");
    const form2 = createMockForm({}, "form2", "Form 2");
    const graph = createMockGraph([], [], [form1, form2]);

    const result = getFormForNode(graph, "nonexistent");

    expect(result).toBeUndefined();
  });

  it("should return first matching form when multiple forms have same id", () => {
    const form1 = createMockForm({}, "duplicate-id", "Form 1");
    const form2 = createMockForm({}, "duplicate-id", "Form 2");
    const graph = createMockGraph([], [], [form1, form2]);

    const result = getFormForNode(graph, "duplicate-id");

    expect(result).toEqual(form1);
  });
});
