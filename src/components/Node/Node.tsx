import { Card, CardContent } from "@/components/ui/card.tsx";
import { FileSpreadsheet } from "lucide-react";

type NodeProps = { title: string; label: string };

export const Node = ({ title, label }: NodeProps) => {
  return (
    <Card className="rounded-xl shadow-sm border-zinc-200">
      <CardContent className="flex items-center justify-start gap-4 px-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
          <FileSpreadsheet className="h-7 w-7 text-indigo-600" />
        </div>
        <div className="flex flex-col min-w-[160px] text-left">
          <div className="text-zinc-500 text-sm leading-none mb-1">{label}</div>
          <div className="text-zinc-900 text-2xl font-semibold leading-tight">
            {title}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
