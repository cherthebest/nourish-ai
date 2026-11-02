import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg bg-[var(--muted)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}