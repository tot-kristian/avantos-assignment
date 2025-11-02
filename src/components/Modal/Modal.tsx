import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "fullscreen";
};

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "default",
}: ModalProps) => {
  const sizeClasses =
    size === "wide"
      ? "min-w-fit"
      : size === "fullscreen"
        ? "min-w-auto min-h-[50vh] max-h-[95vh] max-w-none"
        : "sm:max-w-lg";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClasses}`}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="mt-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
