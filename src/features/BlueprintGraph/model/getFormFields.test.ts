import { getFormFields } from "./getFormFields.ts";
import type { Form } from "@/features/BlueprintGraph/api/types";
import { createMockForm } from "@/features/BlueprintGraph/test/utils/mockFactories.ts";

describe("getFormFields", () => {
  it("should return empty array when form has no properties", () => {
    const form = createMockForm({});

    const result = getFormFields(form);

    expect(result).toEqual([]);
  });

  it("should return empty array when field_schema is undefined", () => {
    const form = {
      id: "form1",
      name: "Test Form",
      field_schema: undefined,
    } as unknown as Form;

    const result = getFormFields(form);

    expect(result).toEqual([]);
  });

  it("should return empty array when properties is undefined", () => {
    const form = {
      id: "form1",
      name: "Test Form",
      field_schema: {
        type: "object",
        properties: undefined,
      },
    } as unknown as Form;

    const result = getFormFields(form);

    expect(result).toEqual([]);
  });

  it("should map string type field", () => {
    const form = createMockForm({
      username: {
        type: "string",
        avantos_type: "button",
      },
    });

    const result = getFormFields(form);

    expect(result).toEqual([
      {
        name: "username",
        label: "username",
        valueType: "string",
        format: undefined,
      },
    ]);
  });

  it("should map array type field", () => {
    const form = createMockForm({
      tags: {
        type: "array",
        avantos_type: "button",
      },
    });

    const result = getFormFields(form);

    expect(result).toEqual([
      {
        name: "tags",
        label: "tags",
        valueType: "array",
        format: undefined,
      },
    ]);
  });

  it("should map object type field", () => {
    const form = createMockForm({
      address: {
        type: "object",
        avantos_type: "button",
      },
    });

    const result = getFormFields(form);

    expect(result).toEqual([
      {
        name: "address",
        label: "address",
        valueType: "object",
        format: undefined,
      },
    ]);
  });

  it("should map email format field", () => {
    const form = createMockForm({
      email: {
        type: "string",
        format: "email",
        avantos_type: "button",
      },
    });

    const result = getFormFields(form);

    expect(result).toEqual([
      {
        name: "email",
        label: "email",
        valueType: "string",
        format: "email",
      },
    ]);
  });

  it("should map multiple fields with different types", () => {
    const form = createMockForm({
      username: { type: "string", avantos_type: "button" },
      age: { type: "string", avantos_type: "button" },
      tags: { type: "array", avantos_type: "button" },
      settings: { type: "object", avantos_type: "button" },
      email: { type: "string", format: "email", avantos_type: "button" },
    });

    const result = getFormFields(form);

    expect(result).toHaveLength(5);
    expect(result).toContainEqual({
      name: "username",
      label: "username",
      valueType: "string",
      format: undefined,
    });
    expect(result).toContainEqual({
      name: "age",
      label: "age",
      valueType: "string",
      format: undefined,
    });
    expect(result).toContainEqual({
      name: "tags",
      label: "tags",
      valueType: "array",
      format: undefined,
    });
    expect(result).toContainEqual({
      name: "settings",
      label: "settings",
      valueType: "object",
      format: undefined,
    });
    expect(result).toContainEqual({
      name: "email",
      label: "email",
      valueType: "string",
      format: "email",
    });
  });

  it("should preserve field order from properties object", () => {
    const form = createMockForm({
      first: { type: "string", avantos_type: "button" },
      second: { type: "array", avantos_type: "button" },
      third: { type: "object", avantos_type: "button" },
    });

    const result = getFormFields(form);

    expect(result[0].name).toBe("first");
    expect(result[1].name).toBe("second");
    expect(result[2].name).toBe("third");
  });
});
