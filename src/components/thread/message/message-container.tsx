import { cn } from "@/lib/utils";

export function MessageContainer({
  children,
  hasPreviousMessage,
  hasNextMessage,
  className,
}: {
  children: React.ReactNode;
  hasPreviousMessage: boolean;
  hasNextMessage: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-3xl px-4",
        className,
        !hasPreviousMessage && "pt-40",
        !hasNextMessage && "pb-48"
      )}
    >
      {children}
    </div>
  );
}
