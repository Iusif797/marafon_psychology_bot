import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[140px] w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-sm transition-all duration-200 resize-y",
        "placeholder:text-muted-foreground/50 font-mono leading-relaxed",
        "hover:border-white/[0.1]",
        "focus-visible:outline-none focus-visible:border-primary/40 focus-visible:bg-white/[0.04] focus-visible:ring-4 focus-visible:ring-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
