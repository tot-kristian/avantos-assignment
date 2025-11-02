import type { ApiMappingEntry } from "./apiMappingEntry.ts";

type Position = {
  x: number;
  y: number;
};

type NodeData = {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  input_mapping: Record<string, ApiMappingEntry>;
};

export type GraphNode = {
  id: string;
  type: string;
  position: Position;
  data: NodeData;
};
