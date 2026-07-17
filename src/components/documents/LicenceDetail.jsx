import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { X, Bell, Stethoscope, RefreshCw } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";

export function dayDiff(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(dateStr);
  exp.setHours(0, 0, 0, 0);
  return Math.round((exp - today) / (1000 * 60 * 60 * 24));
}

export function ringColor(days) {
  if (days === null) return "#8893A8";
  if (days <= 0) return "#FF6B6B";
  if (days <= 90) return "#F5B73C";
  return "#6FE0A6";
}

export function ExpiryRing({ days, size = 44, stroke = 4 }) {
  const color = ringColor(days);
  const R = (size - stroke * 2) / 2;
  const C = 2 * Math.PI * R;
  const pct = days === null ? 0 : Math.max(0, Math.min(1, days / 365));
  const dash = C * pct;
  const label = days === null ? "—" : days <= 0 ? "EXP" : days;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke="#243049" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={R} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold leading-none" style={{ color, fontSize: size * 0.28 }}>
          {label}
        </span>
        {size >= 60 && <span className="text-[8px] text-cockpit-muted uppercase mt-0.5">days</span>}
      </div>
    </div>
  );
}

function DateRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-cockpit-border last:border-0">
      <span className="text-xs text-cockpit-muted uppercase tracking-wider">{label}</span>
      <span className="text-sm text-cockpit-cream font-mono">{value || "—"}</span>
    </div>
  );
}

export default function LicenceDetail({ licence, onClose }) {
  const { toast } = useToast();
  const days = dayDiff(licence.expiry_date);
  const isMedical = licence.category === "Medical";
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <BottomSheet onClose={onClose}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <ExpiryRing days={days} size={72} stroke={5} />
            <div>
              <p className="text-base font-bold text-cockpit-cream">{licence.name}</p>
              <div className="flex gap-1.5 mt-1">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-cockpit-amber/10 text-cockpit-amber">
                  {licence.category}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-cockpit-valid/10 text-cockpit-valid">
                  {licence.framework || "—"}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-cockpit-muted hover:text-cockpit-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-4 mb-4">
          <DateRow label="Category" value={licence.category} />
          <DateRow label="Authority" value={licence.framework} />
          <DateRow label="Discipline" value={licence.discipline} />
          <DateRow label="Issue date" value={fmt(licence.issue_date)} />
          <DateRow label="Expiry date" value={fmt(licence.expiry_date)} />
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full border-cockpit-border text-cockpit-muted hover:text-cockpit-cream justify-start"
            onClick={() => toast({ title: "Renewal reminder set", description: `We'll remind you before ${licence.name} expires.` })}
          >
            <Bell className="w-4 h-4" /> Set renewal reminder
          </Button>
          {isMedical && (
            <Button
              variant="outline"
              className="w-full border-cockpit-border text-cockpit-muted hover:text-cockpit-cream justify-start"
              onClick={() => toast({ title: "DAME appointment requested", description: "Your Designated Aviation Medical Examiner will contact you." })}
            >
              <Stethoscope className="w-4 h-4" /> Request DAME appointment (auto)
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full border-cockpit-valid/30 text-cockpit-valid hover:bg-cockpit-valid/10 justify-start"
            onClick={() => toast({ title: "Marked as renewed", description: `${licence.name} renewal recorded.` })}
          >
            <RefreshCw className="w-4 h-4" /> Mark as renewed
          </Button>
        </div>
    </BottomSheet>
  );
}