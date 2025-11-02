import type { ApiMappingEntry } from "./apiMappingEntry.ts";

type Position = {
  x: number;
  y: number;
};

type SLADuration = {
  number: number;
  unit: "minutes" | "hours" | "days";
};

type NodeData = {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: Record<string, ApiMappingEntry>;
  sla_duration: SLADuration;
  approval_required: boolean;
  approval_roles: string[];
};

export type GraphNode = {
  id: string;
  type: string;
  position: Position;
  data: NodeData;
};
