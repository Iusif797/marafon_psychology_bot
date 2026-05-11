import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-sm transition-all duration-200",
        "placeholder:text-muted-foreground/50",
        "hover:border-white/[0.1]",
        "focus-visible:outline-none focus-visible:border-primary/40 focus-visible:bg-white/[0.04] focus-visible:ring-4 focus-visible:ring-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
