import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import usePilot from "@/hooks/usePilot";
import { PRICES } from "@/lib/plan";
import {
  CreditCard, Landmark, Check, Loader2, Copy, Upload, ChevronLeft, ShieldCheck, Sparkles,
} from "lucide-react";
import Seo from "@/components/Seo";

const genRef = () =>
  "PH-" + Array.from({ length: 6 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("");

const PLAN_META = {
  annual: { key: "cpl_annual", usd: PRICES.annualUsd, zarRef: PRICES.annualZarRef, label: PRICES.annualLabel, note: "Best value · billed yearly" },
  monthly: { key: "cpl_monthly", usd: PRICES.monthlyUsd, zarRef: PRICES.monthlyZarRef, label: PRICES.monthlyLabel, note: "Billed monthly · cancel anytime" },
};

export default function Upgrade() {
  const navigate = useNavigate();
  const { pilot, loading, reload } = usePilot();
  const [params] = useSearchParams();
  const returning = params.get("stripe") === "return";

  const [plan, setPlan] = useState("annual");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [bankReq, setBankReq] = useState(null);
  const [bank, setBank] = useState(null);
  const [copied, setCopied] = useState(false);

  const meta = PLAN_META[plan];
  const alreadyPaid = pilot && (pilot.plan === "cpl" || pilot.plan === "school");

  useEffect(() => {
    if (returning && reload) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returning]);

  const payByCard = async () => {
    setBusy("card"); setError("");
    try {
      const res = await base44.functions.invoke("stripeCreateCheckout", { plan: meta.key });
      if (res?.url) { window.location.href = res.url; return; }
      setError(res?.error || "Could not start the card payment. Please try again.");
    } catch (e) {
      setError(e.message || "Could not start the card payment.");
    } finally { setBusy(""); }
  };

  const payByBank = async () => {
    setBusy("bank"); setError("");
    try {
      const reference = genRef();
      const pr = await base44.entities.PaymentRequest.create({
        pilot_id: pilot?.id || "",
        plan: meta.key,
        amount_zar: meta.zarRef,
        method: "bank_transfer",
        reference,
        status: "pending",
      });
      setBankReq(pr);
      try {
        const cfg = await base44.functions.invoke("paymentConfig", {});
        setBank(cfg?.bank || {});
      } catch { setBank({}); }
    } catch (e) {
      setError(e.message || "Could not create the bank-transfer request.");
    } finally { setBusy(""); }
  };

  const copyRef = () => {
    if (!bankReq?.reference) return;
    try { navigator.clipboard.writeText(bankReq.reference); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  };

  const uploadProof = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !bankReq) return;
    setBusy("proof"); setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.PaymentRequest.update(bankReq.id, { proof_url: file_url });
      setBankReq({ ...bankReq, proof_url: file_url });
    } catch (err) {
      setError(err.message || "Couldn't upload the proof — try again.");
    } finally { setBusy(""); }
  };

  const Row = ({ label, value }) => (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-cockpit-border last:border-0">
      <span className="text-xs text-cockpit-muted">{label}</span>
      <span className="text-sm text-cockpit-cream font-medium text-right break-all">{value || "—"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-cockpit-bg px-4 pt-6 pb-24 max-w-lg mx-auto">
      <Seo noindex title="Upgrade — PilotHobb" description="Upgrade to PilotHobb CPL." />

      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-cockpit-muted mb-4">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(79,70,229,.14)", border: "1px solid rgba(79,70,229,.28)" }}>
          <Sparkles className="w-6 h-6 text-cockpit-amber" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-cockpit-cream leading-none">Upgrade to CPL</h1>
          <p className="text-xs text-cockpit-muted mt-1">Unlimited logging & authority-ready exports</p>
        </div>
      </div>

      {returning && !alreadyPaid && (
        <div className="mb-4 rounded-xl bg-cockpit-glow-blue/10 border border-cockpit-glow-blue/30 p-3 text-xs text-cockpit-cream">
          Finishing your payment… this can take a moment. Pull to refresh if your plan doesn't update shortly.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-cockpit-amber animate-spin" /></div>
      ) : alreadyPaid ? (
        <div className="rounded-2xl bg-cockpit-panel border border-cockpit-valid/40 p-5">
          <div className="flex items-center gap-2 text-cockpit-valid mb-3"><ShieldCheck className="w-5 h-5" /> <span className="font-semibold">You're on {pilot.plan === "school" ? "the School plan" : "CPL"}</span></div>
          <Row label="Plan" value={pilot.plan === "school" ? "School" : "CPL"} />
          <Row label="Renews" value={pilot.plan_valid_until ? new Date(pilot.plan_valid_until).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"} />
          <Row label="Activated via" value={pilot.plan_source ? pilot.plan_source.replace("_", " ") : "—"} />
          <button onClick={() => navigate("/dashboard")} className="mt-4 w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">Back to dashboard</button>
        </div>
      ) : (
        <>
          {/* Plan cards */}
          <div className="grid grid-cols-2 gap-3">
            {["annual", "monthly"].map((p) => {
              const m = PLAN_META[p];
              const active = plan === p;
              const highlight = p === "annual";
              return (
                <button key={p} onClick={() => { setPlan(p); setBankReq(null); }}
                  className={`text-left rounded-2xl p-4 border transition-all ${active ? "border-cockpit-amber bg-cockpit-amber/10" : "border-cockpit-border bg-cockpit-panel"}`}>
                  {highlight && <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-cockpit-amber mb-1">Best value</span>}
                  <p className="text-sm text-cockpit-muted">{p === "annual" ? "CPL Annual" : "CPL Monthly"}</p>
                  <p className="font-heading text-2xl font-bold text-cockpit-cream mt-0.5">{m.label}</p>
                  <p className="text-[11px] text-cockpit-muted">≈ R{m.zarRef}</p>
                  <p className="text-[11px] text-cockpit-muted mt-1">{m.note}</p>
                  {active && <Check className="w-4 h-4 text-cockpit-amber mt-2" />}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-4 text-xs text-cockpit-expired text-center">{error}</p>}

          {!bankReq && (
            <div className="mt-5 space-y-3">
              <button onClick={payByCard} disabled={!!busy}
                className="w-full flex items-center justify-center gap-2 bg-cockpit-amber text-white font-semibold rounded-xl py-3.5 disabled:opacity-50">
                {busy === "card" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />} Pay by card
              </button>
              <button onClick={payByBank} disabled={!!busy}
                className="w-full flex items-center justify-center gap-2 bg-cockpit-panel border border-cockpit-border text-cockpit-cream font-semibold rounded-xl py-3.5 disabled:opacity-50">
                {busy === "bank" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />} Pay by bank transfer
              </button>
              <p className="text-[11px] text-cockpit-muted text-center flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> Card payments secured by Stripe. We never store your card details.</p>
            </div>
          )}

          {/* Bank transfer instructions */}
          {bankReq && (
            <div className="mt-5 rounded-2xl bg-cockpit-panel border border-cockpit-border p-5">
              <p className="text-sm font-semibold text-cockpit-cream mb-3">Bank transfer</p>
              <Row label="Account name" value={bank?.accountName} />
              <Row label="Bank" value={bank?.bankName} />
              <Row label="IBAN" value={bank?.iban} />
              <Row label="SWIFT" value={bank?.swift} />
              <Row label="Amount" value={`$${meta.usd} (≈ R${meta.zarRef})`} />

              <div className="mt-4">
                <p className="text-[11px] text-cockpit-muted uppercase tracking-wider mb-1">Reference</p>
                <div className="flex items-center gap-2">
                  <span className="flex-1 font-mono text-2xl font-bold text-cockpit-amber tracking-wide">{bankReq.reference}</span>
                  <button onClick={copyRef} className="p-2 rounded-lg bg-cockpit-amber/10 border border-cockpit-amber/30 text-cockpit-amber">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-cockpit-muted mt-2">Use the reference exactly. Activation within 1 business day.</p>
              </div>

              <div className="mt-5">
                <label className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-cockpit-border py-3 text-sm text-cockpit-cream cursor-pointer">
                  {busy === "proof" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {bankReq.proof_url ? "Replace proof of payment" : "Upload proof of payment"}
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={uploadProof} />
                </label>
                {bankReq.proof_url && <p className="text-[11px] text-cockpit-valid text-center mt-2">Proof uploaded ✓</p>}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${bankReq.status === "paid" ? "bg-cockpit-valid/15 text-cockpit-valid" : "bg-cockpit-amber/15 text-cockpit-amber"}`}>
                  {bankReq.status === "paid" ? "Paid" : "Pending activation"}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
