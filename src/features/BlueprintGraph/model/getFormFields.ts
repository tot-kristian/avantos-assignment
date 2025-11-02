import type { Form } from "@/features/BlueprintGraph/api/types";
import type { TargetField } from "@/features/BlueprintGraph/model/dataSource/types";

export const getFormFields = (form: Form): TargetField[] => {
  const props = form?.field_schema?.properties ?? {};
  return Object.entries(props).map(([name, prop]) => {
    return {
      name,
      label: name,
      valueType: prop.type,
      format: prop.format,
    };
  });
};
