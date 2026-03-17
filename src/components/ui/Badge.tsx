import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "muted" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        {
          "bg-[#1f1f1f] text-white": variant === "default",
          "bg-[#111] text-[#888]": variant === "muted",
          "bg-green-900/40 text-green-400": variant === "success",
          "bg-yellow-900/40 text-yellow-400": variant === "warning",
          "bg-red-900/40 text-red-400": variant === "danger",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
