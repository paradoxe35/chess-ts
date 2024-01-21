import { cn } from "@/utils/cn";

export const Loader = () => {
  return (
    <div
      className={cn(
        "absolute top-0",
        "inline-block h-10 w-10 animate-spin rounded-full border-[2px]",
        "border-solid border-current border-r-transparent text-pink-500",
        "align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
