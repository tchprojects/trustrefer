"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-40",
          {
            // variants
            "bg-white text-black hover:bg-[#e0e0e0]": variant === "primary",
            "border border-[#1f1f1f] bg-[#0a0a0a] text-white hover:bg-[#111111] hover:border-[#333]":
              variant === "secondary",
            "text-white hover:bg-[#111111]": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700": variant === "danger",
            // sizes
            "h-8 rounded px-3 text-xs": size === "sm",
            "h-10 rounded-md px-4 text-sm": size === "md",
            "h-12 rounded-md px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
