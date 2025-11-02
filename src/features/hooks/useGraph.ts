import { useContext } from "react";
import { GraphContext } from "@/features/context/GraphContext.tsx";

export const useGraph = () => {
  const context = useContext(GraphContext);

  if (!context) {
    throw new Error("useGraph must be used within GraphProvider");
  }

  return context;
};
