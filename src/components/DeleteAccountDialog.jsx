import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteAccountDialog({ onClose, onDeleted }) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await base44.functions.invoke("deleteAccount", {});
      onDeleted?.();
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Failed to delete account");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-cockpit-panel border border-cockpit-border p-6">
        {step === 1 ? (
          <>
            <div className="w-12 h-12 rounded-full bg-cockpit-expired/10 border border-cockpit-expired/30 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-cockpit-expired" />
            </div>
            <h2 className="font-heading text-lg font-bold text-cockpit-cream mb-2">Delete account?</h2>
            <p className="text-sm text-cockpit-muted mb-5">
              This will permanently delete your profile, flights, documents, and fleet data. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1 border-cockpit-border text-cockpit-muted hover:text-cockpit-cream">
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1 bg-cockpit-expired text-cockpit-bg hover:bg-cockpit-expired/90">
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-heading text-lg font-bold text-cockpit-expired mb-2">Are you absolutely sure?</h2>
            <p className="text-sm text-cockpit-muted mb-2">
              This is your final confirmation. Your account and all associated data will be permanently removed.
            </p>
            {error && <p className="text-xs text-cockpit-expired mb-3">{error}</p>}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={onClose} disabled={busy} className="flex-1 border-cockpit-border text-cockpit-muted hover:text-cockpit-cream">
                No, keep account
              </Button>
              <Button onClick={handleConfirm} disabled={busy} className="flex-1 bg-cockpit-expired text-cockpit-bg hover:bg-cockpit-expired/90">
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy ? "Deleting…" : "Delete permanently"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}