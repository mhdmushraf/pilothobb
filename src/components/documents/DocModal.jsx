import React from "react";
import { X } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";

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
    <BottomSheet onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-cockpit-cream">{title}</h2>
        <button onClick={onClose} className="p-1 text-cockpit-muted hover:text-cockpit-cream">
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
      {footer && <div className="mt-4">{footer}</div>}
    </BottomSheet>
  );
}