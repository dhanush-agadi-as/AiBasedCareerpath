import React from "react";
import { cn } from "../../lib/utils";
import { AlertTriangle } from "lucide-react";

export function Alert({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-yellow-800",
        className
      )}
      {...props}
    >
      <AlertTriangle size={18} />
      <div>{children}</div>
    </div>
  );
}
