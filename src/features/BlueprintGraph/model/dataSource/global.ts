import type { DataSource } from "./types";

export const GlobalSource: DataSource = {
  id: "global",
  label: "Global data",
  listFor() {
    return [
      {
        id: "global:action.title",
        group: "Action Properties",
        label: "title",
        valueType: "string",
        entry: {
          type: "metadata",
          component_key: "action",
          output_key: "title",
          is_metadata: true,
        },
      },
      {
        id: "global:client.email",
        group: "Client Organization",
        label: "contact.email",
        valueType: "string",
        format: "email",
        entry: {
          type: "metadata",
          component_key: "clientOrg",
          output_key: "contact.email",
          is_metadata: true,
        },
      },
    ];
  },
};
