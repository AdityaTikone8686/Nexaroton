import React from "react";
import { useApp } from "../lib/store.jsx";

export default function ToastHost() {
  const { toasts } = useApp();
  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div key={t.id} className={"toast" + (t.kind === "danger" ? " danger" : "")}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
