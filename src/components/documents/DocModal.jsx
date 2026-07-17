import React from "react";
import { X } from "lucide-react";

export function Field({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-cockpit-muted uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-cockpit-muted">{hint}</p>}
    </div>
  );
}

export default function DocModal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-cockpit-panel border border-cockpit-border p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-cockpit-cream">{title}</h2>
          <button onClick={onClose} className="p-1 text-cockpit-muted hover:text-cockpit-cream">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}