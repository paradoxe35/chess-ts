import { useMemo, useRef } from "react";

export function useSyncRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = useMemo(() => value, [value]);
  return ref;
}

export function useCallbackRef<T extends (...data: any[]) => void>(func: T) {
  const ref = useRef(func);

  ref.current = func;

  return ref;
}
