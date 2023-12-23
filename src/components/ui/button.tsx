import { cn } from "@/utils/cn";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "outline" | "secondary";
  }
) {
  return (
    <button
      {...props}
      className={cn(
        props.variant === "outline" && [
          "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium",
          "text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400",
          "group-hover:from-pink-500 group-hover:to-orange-400  text-white ",
          "outline-none",
        ],

        props.variant === "secondary" && [
          "bg-white hover:bg-gray-100 border text-white border-gray-200 outline-none font-medium",
          "rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-gray-600 bg-gray-800",
          "border-gray-700 hover:bg-gray-700 me-2 mb-2",
        ],

        props.className
      )}
    >
      {props.variant === "outline" && (
        <span
          className={cn(
            "relative px-5 py-2.5 transition-all ease-in duration-75",
            "bg-gray-900 rounded-md group-hover:bg-opacity-0",
            "w-full"
          )}
        >
          {props.children}
        </span>
      )}

      {props.variant !== "outline" && props.children}
    </button>
  );
}
