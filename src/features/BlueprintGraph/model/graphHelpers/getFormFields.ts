import type {
  Form,
  JSONSchemaProperty,
} from "@/features/BlueprintGraph/api/types";
import type {
  FieldFormat,
  FieldKind,
  TargetField,
} from "@/features/BlueprintGraph/model/dataSource/types";

const mapPropertyType = (
  prop: JSONSchemaProperty,
): {
  valueType: FieldKind;
  format?: FieldFormat;
} => {
  const t = prop?.type;
  if (t === "array") return { valueType: "array" };
  if (t === "object") return { valueType: "object" };

  const format = prop?.format === "email" ? "email" : undefined;
  return { valueType: "string", format };
};

export const getFormFields = (form: Form): TargetField[] => {
  const props = form?.field_schema?.properties ?? {};
  return Object.entries(props).map(([name, prop]) => {
    const { valueType, format } = mapPropertyType(prop);
    return {
      name,
      label: name,
      valueType,
      format,
    };
  });
};
