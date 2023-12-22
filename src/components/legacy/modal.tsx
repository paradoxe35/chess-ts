import { createPortal } from "react-dom";
import { PropsWithChildren } from "react";

export function Modal({ children }: PropsWithChildren) {
  if (typeof window === "undefined") {
    return <></>;
  }

  const body = (
    <div className="modal">
      <div className="modal-content">{children}</div>
    </div>
  );

  return createPortal(body, document.body);
}
