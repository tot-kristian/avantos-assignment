import type { DataSource } from "./types";
import {
  getDirectParentNodes,
  getFormFields,
  getFormForNode,
} from "@/features/BlueprintGraph/model/graphHelpers";

export const DirectParentDataSource: DataSource = {
  id: "direct-parent",
  label: "Direct parent data",
  listFor({ graph, targetNodeId }) {
    const parentNodes = getDirectParentNodes(graph, targetNodeId);

    const forms = parentNodes
      .map((node) => {
        return {
          node,
          form: getFormForNode(graph, node.data.component_id),
        };
      })
      .filter((f) => f.form);

    return forms.flatMap(({ form, node }) => {
      const fields = getFormFields(form!);

      return fields.map((f) => {
        return {
          id: `direct:${node.id}:${f.name}`,
          group: node.data.name,
          label: f.label,
          valueType: f.valueType,
          entry: {
            type: "form_field",
            component_key: node.data.component_key,
            output_key: f.name,
            is_metadata: false,
          },
        };
      });
    });
  },
};
