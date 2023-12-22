import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: (string | boolean)[]) {
  return twMerge(clsx(classes));
}
