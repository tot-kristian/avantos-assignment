import { create } from "zustand";

export type PrefillRef =
  | { kind: "form-field"; nodeId: string; field: string }
  | { kind: "global"; ns: string; path: string };

type PrefillByNode = Record<string, Record<string, PrefillRef | null>>;

type S = {
  byNode: PrefillByNode;
  getMapping: (nodeId: string) => Record<string, PrefillRef | null>;
  setMapping: (nodeId: string, field: string, ref: PrefillRef | null) => void;
};

export const usePrefillStore = create<S>((set, get) => ({
  byNode: JSON.parse(localStorage.getItem("prefill") || "{}"),
  getMapping: (nodeId) => get().byNode[nodeId] ?? {},
  setMapping: (nodeId, field, ref) => {
    const next = structuredClone(get().byNode);
    next[nodeId] ??= {};
    next[nodeId][field] = ref;
    localStorage.setItem("prefill", JSON.stringify(next));
    set({ byNode: next });
  },
}));