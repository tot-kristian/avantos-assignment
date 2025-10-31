import { useBlueprintGraphQuery } from "@/hooks/useBlueprintGraphQuery.ts";
import { Node } from "@/components/Node/Node.tsx";

export const Graph = () => {
  const { data, isPending } = useBlueprintGraphQuery({
    tenantId: "1",
    blueprintId: "1",
  });
  console.log(data);

  if (isPending) return <div>Loading...</div>;
  return (
    <div>
      {data?.forms?.map((form: { id: string; name: string }) => {
        return <Node key={form.id} title={form.name} label="Form" />;
      })}
    </div>
  );
};
