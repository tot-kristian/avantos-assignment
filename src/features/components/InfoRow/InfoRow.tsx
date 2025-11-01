export const InfoRow = ({
  label,
  value,
  fontMono = false,
}: {
  label: string;
  value: string;
  fontMono?: boolean;
}) => {
  return (
    <div className="grid grid-cols-[140px_1fr] py-1">
      <div className="text-muted-foreground">{label}</div>
      <div className={fontMono ? "font-mono truncate" : ""}>{value}</div>
    </div>
  );
};
