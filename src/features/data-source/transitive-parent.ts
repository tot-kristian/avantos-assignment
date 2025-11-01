import type { DataSource } from "@/features/model/types.ts";
import {
  getFormFields,
  getFormForNode,
  getTransitiveParentNodes,
} from "@/features/model/graph-helpers.ts";

export const TransitiveParentDataSource: DataSource = {
  id: "transitive-parent",
  label: "Transitive parent data",
  listFor({ graph, targetNodeId }) {
    const parentNodes = getTransitiveParentNodes(graph, targetNodeId);

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
          id: `transitive:${node.id}:${f.name}`,
          group: node.data.name,
          label: f.label,
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
