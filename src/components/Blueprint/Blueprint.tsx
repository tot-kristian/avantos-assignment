import { useFetchForms } from "@/hooks/useFetchForms.ts";
import { Node } from "@/components/Node/Node.tsx";

export const Blueprint = () => {
  const { data } = useFetchForms({ tenantId: "1", blueprintId: "1" });
  console.log(data);
  return (
    <div>
      {data.forms?.map((form: { id: string; name: string }) => {
        return <Node key={form.id} title={form.name} label="Form" />;
      })}
    </div>
  );
};
