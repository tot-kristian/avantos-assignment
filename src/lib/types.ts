type GraphEdge = { source: string; target: string };

export type Response = {
  $schema: string;
  blueprint_id: string;
  blueprint_name: string;
  edges: GraphEdge[];

  forms: [];
};
