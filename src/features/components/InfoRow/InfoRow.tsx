export const InfoRow = ({
  key,
  value,
  fontMono = false,
}: {
  key: string;
  value: string;
  fontMono?: boolean;
}) => {
  return (
    <div className="grid grid-cols-[140px_1fr] py-1">
      <div className="text-muted-foreground">{key}</div>
      <div className={fontMono ? "font-mono truncate" : ""}>{value}</div>
    </div>
  );
};
