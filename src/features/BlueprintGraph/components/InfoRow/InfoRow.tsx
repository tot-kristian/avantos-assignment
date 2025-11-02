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
    <div className="flex justify-between py-1">
      <div
        className="text-muted-foreground min-w-32"
        data-testid="info-row-label"
      >
        {label}
      </div>
      <div
        className={fontMono ? "font-mono truncate" : ""}
        data-testid="info-row-value"
      >
        {value}
      </div>
    </div>
  );
};
