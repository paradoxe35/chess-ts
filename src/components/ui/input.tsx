import { cn } from "@/utils/cn";
import React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "bg-slate-50/10 border-none",
        "h-12 min-w-80",
        "text-white/75 text-sm rounded-lg block w-full p-2.5 font-medium",
        "focus:outline-none focus:ring-0 focus:ring-offset-0",
        props.className
      )}
    />
  );
}
