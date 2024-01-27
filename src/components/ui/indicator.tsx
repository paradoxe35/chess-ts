import { cn } from "@/utils/cn";

export function Indicator({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "-top-1 start-4 absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full",
        className
      )}
    />
  );
}
