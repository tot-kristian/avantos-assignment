import type { DataSource } from "@/features/model/types.ts";
import {
  getDirectParentNodes,
  getFormFields,
  getFormForNode,
} from "@/features/model/graph-helpers.ts";

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
          label: `${node.data.name} - ${f.label}`,
          valueType: f.valueType,
          entry: {
            type: "form_field",
            component_key: node.id,
            output_key: f.name,
            is_metadata: false,
          },
        };
      });
    });
  },
};
