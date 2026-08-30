import React from "react";
import { useNavigate } from "react-router-dom";
import BottomSheet from "@/components/BottomSheet";
import { PRICES } from "@/lib/plan";
import { Sparkles, ArrowRight, Check } from "lucide-react";

// Trigger → headline + supporting line.
const COPY = {
  flights: {
    head: "You've logged 50 flights",
    sub: "That's the free plan limit. Upgrade to CPL for unlimited flights and the full logbook.",
  },
  aircraft: {
    head: "You've added 3 aircraft",
    sub: "Free covers 3 aircraft. Upgrade to CPL for an unlimited fleet.",
  },
  signatures: {
    head: "You've used 5 signatures",
    sub: "Free includes 5 instructor signatures. Upgrade to CPL for unlimited signatures.",
  },
  export: {
    head: "Authority-ready export is a CPL feature",
    sub: "Upgrade to CPL for the SACAA-format logbook and a clean, watermark-free PDF.",
  },
};

const PERKS = [
  "Unlimited flights, aircraft & signatures",
  "SACAA-format logbook & clean PDF export",
  "Priority currency alerts",
];

export default function UpgradeSheet({ trigger = "flights", onClose }) {
  const navigate = useNavigate();
  const c = COPY[trigger] || COPY.flights;

  const go = (path) => {
    if (onClose) onClose();
    navigate(path);
  };

  return (
    <BottomSheet onClose={onClose}>
      <div className="text-center pt-1">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(79,70,229,.14)", border: "1px solid rgba(79,70,229,.28)" }}
        >
          <Sparkles className="w-7 h-7 text-cockpit-amber" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-cockpit-cream">{c.head}</h2>
        <p className="text-sm text-cockpit-muted mt-2 max-w-xs mx-auto">{c.sub}</p>
      </div>

      <div className="mt-5 rounded-2xl bg-cockpit-panel-light border border-cockpit-border p-4">
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-heading text-3xl font-bold text-cockpit-cream">{PRICES.annualLabel}</span>
          <span className="text-sm text-cockpit-muted">or {PRICES.monthlyLabel}</span>
        </div>
        <ul className="mt-4 space-y-2">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-cockpit-cream">
              <Check className="w-4 h-4 text-cockpit-valid mt-0.5 shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => go("/upgrade")}
        className="mt-5 w-full flex items-center justify-center gap-2 bg-cockpit-amber text-white font-semibold rounded-xl py-3.5 active:scale-[0.99] transition-transform"
      >
        Upgrade to CPL <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => go("/export")}
        className="mt-3 w-full text-center text-sm font-medium text-cockpit-muted py-1"
      >
        Export CSV instead
      </button>
    </BottomSheet>
  );
}
