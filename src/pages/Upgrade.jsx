import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import usePilot from "@/hooks/usePilot";
import { PRICES } from "@/lib/plan";
import {
  CreditCard, Landmark, Check, Loader2, Copy, Upload, ChevronLeft, ShieldCheck, Sparkles, CalendarClock, X,
} from "lucide-react";
import Seo from "@/components/Seo";

const genRef = () =>
  "PH-" + Array.from({ length: 6 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("");

const PLAN_META = {
  annual: { key: "cpl_annual", usd: PRICES.annualUsd, zarRef: PRICES.annualZarRef, label: PRICES.annualLabel, per: "/year", note: "Best value · billed yearly" },
  monthly: { key: "cpl_monthly", usd: PRICES.monthlyUsd, zarRef: PRICES.monthlyZarRef, label: PRICES.monthlyLabel, per: "/month", note: "Billed monthly · cancel anytime" },
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const daysLeft = (iso) => {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
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
  const status = pilot?.subscription_status || "none";
  const hasStripeSub = !!pilot?.stripe_subscription_id && ["trialing", "active", "past_due", "canceling"].includes(status);
  const hasPlan = pilot?.plan === "cpl" || pilot?.plan === "school";
  const hasSub = hasStripeSub || hasPlan;

  useEffect(() => {
    if (returning && reload) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returning]);

  const startTrial = async () => {
    setBusy("card"); setError("");
    try {
      const res = await base44.functions.invoke("stripeCreateCheckout", { plan: meta.key });
      if (res?.url) { window.location.href = res.url; return; }
      setError(res?.error || "Could not start your trial. Please try again.");
    } catch (e) {
      setError(e.message || "Could not start your trial.");
    } finally { setBusy(""); }
  };

  const cancelSub = async () => {
    if (!window.confirm("Cancel your subscription? You'll keep access until the end of your current period.")) return;
    setBusy("cancel"); setError("");
    try {
      const res = await base44.functions.invoke("stripeCancelSubscription", {});
      if (res?.ok) { reload && reload(); }
      else setError(res?.error || "Could not cancel. Please try again.");
    } catch (e) {
      setError(e.message || "Could not cancel.");
    } finally { setBusy(""); }
  };

  const payByBank = async () => {
    setBusy("bank"); setError("");
    try {
      const reference = genRef();
      const pr = await base44.entities.PaymentRequest.create({
        pilot_id: pilot?.id || "", plan: meta.key, amount_zar: meta.zarRef,
        method: "bank_transfer", reference, status: "pending",
      });
      setBankReq(pr);
      try { const cfg = await base44.functions.invoke("paymentConfig", {}); setBank(cfg?.bank || {}); }
      catch { setBank({}); }
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
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-cockpit-border last:border-0">
      <span className="text-xs text-cockpit-muted">{label}</span>
      <span className="text-sm text-cockpit-cream font-medium text-right break-all">{value || "—"}</span>
    </div>
  );

  const trialDays = daysLeft(pilot?.trial_ends_at);

  return (
    <div className="min-h-screen bg-cockpit-bg px-5 pt-6 pb-24 max-w-lg mx-auto">
      <Seo noindex title="Upgrade — PilotHobb" description="Start your PilotHobb CPL free trial." />

      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-cockpit-muted mb-5 hover:text-cockpit-cream transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(79,70,229,.14)", border: "1px solid rgba(79,70,229,.28)" }}>
          <Sparkles className="w-6 h-6 text-cockpit-amber" />
        </div>
        <div>
          <h1 className="font-heading text-[26px] font-bold text-cockpit-cream leading-tight">PilotHobb CPL</h1>
          <p className="text-[13px] text-cockpit-muted mt-0.5">Unlimited logging · authority-ready exports</p>
        </div>
      </div>

      {returning && !hasSub && (
        <div className="mb-4 rounded-xl bg-cockpit-glow-blue/10 border border-cockpit-glow-blue/30 p-3 text-xs text-cockpit-cream">
          Finishing up… this can take a few seconds. Refresh if your status doesn't update shortly.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-cockpit-amber animate-spin" /></div>
      ) : hasSub ? (
        /* ---------- Active subscription / trial state ---------- */
        <div className="rounded-2xl bg-cockpit-panel border border-cockpit-valid/40 p-5">
          <div className="flex items-center gap-2 text-cockpit-valid mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-heading font-bold text-lg">
              {status === "trialing" ? "Free trial active"
                : status === "canceling" ? "Subscription ending"
                : status === "past_due" ? "Payment needs attention"
                : "CPL active"}
            </span>
          </div>
          {status === "trialing" && (
            <p className="text-sm text-cockpit-cream mb-3">
              {trialDays === 0 ? "Your trial ends today." : `${trialDays} day${trialDays === 1 ? "" : "s"} left on your free trial.`}
            </p>
          )}
          <div className="mt-2">
            <Row label="Plan" value="CPL" />
            <Row label={status === "trialing" ? "First charge" : status === "canceling" ? "Access until" : "Renews"} value={fmtDate(pilot.plan_valid_until)} />
            <Row label="Status" value={status.charAt(0).toUpperCase() + status.slice(1)} />
            <Row label="Activated via" value={pilot.plan_source ? pilot.plan_source.replace("_", " ") : "—"} />
          </div>

          {error && <p className="mt-3 text-xs text-cockpit-expired text-center">{error}</p>}

          <button onClick={() => navigate("/dashboard")} className="mt-4 w-full bg-cockpit-amber text-white font-semibold rounded-xl py-3">
            Back to dashboard
          </button>

          {hasStripeSub && (status === "trialing" || status === "active" || status === "past_due") && (
            <button onClick={cancelSub} disabled={!!busy}
              className="mt-2 w-full flex items-center justify-center gap-2 text-sm text-cockpit-muted hover:text-cockpit-expired py-2 disabled:opacity-50">
              {busy === "cancel" ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Cancel subscription
            </button>
          )}
          {status === "canceling" && (
            <p className="mt-3 text-[11px] text-cockpit-muted text-center">
              Cancelled — you keep full access until {fmtDate(pilot.plan_valid_until)}.
            </p>
          )}
        </div>
      ) : (
        /* ---------- Trial / purchase entry ---------- */
        <>
          <div className="rounded-2xl bg-cockpit-amber/10 border border-cockpit-amber/25 px-4 py-3 mb-4 flex items-center gap-2.5">
            <CalendarClock className="w-5 h-5 text-cockpit-amber shrink-0" />
            <p className="text-[13px] text-cockpit-cream">
              <span className="font-semibold">5 days free</span>, then your plan. Cancel anytime before it ends and you won't be charged.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-2 gap-3">
            {["annual", "monthly"].map((p) => {
              const m = PLAN_META[p];
              const active = plan === p;
              const highlight = p === "annual";
              return (
                <button key={p} onClick={() => { setPlan(p); setBankReq(null); }}
                  className={`text-left rounded-2xl p-4 border transition-all ${active ? "border-cockpit-amber bg-cockpit-amber/10 ring-1 ring-cockpit-amber/40" : "border-cockpit-border bg-cockpit-panel"}`}>
                  {highlight
                    ? <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-cockpit-amber mb-1">Best value · save 30%</span>
                    : <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-cockpit-muted mb-1">Flexible</span>}
                  <p className="text-[13px] text-cockpit-muted">{p === "annual" ? "CPL Annual" : "CPL Monthly"}</p>
                  <p className="font-heading text-[26px] font-bold text-cockpit-cream mt-0.5 leading-none">
                    ${m.usd}<span className="font-body text-[13px] font-medium text-cockpit-muted">{m.per}</span>
                  </p>
                  <p className="text-[11px] text-cockpit-muted mt-1">≈ R{m.zarRef}</p>
                  {active && <Check className="w-4 h-4 text-cockpit-amber mt-2" />}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-4 text-xs text-cockpit-expired text-center">{error}</p>}

          {!bankReq && (
            <div className="mt-5 space-y-3">
              <button onClick={startTrial} disabled={!!busy}
                className="w-full flex items-center justify-center gap-2 bg-cockpit-amber text-white font-semibold rounded-xl py-4 text-[15px] disabled:opacity-50 hover:shadow-lg hover:shadow-cockpit-amber/25 transition-shadow">
                {busy === "card" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Start 5-day free trial
              </button>
              <p className="text-[11px] text-cockpit-muted text-center">
                Card required · charged {meta.label} after 5 days · cancel anytime
              </p>

              <button onClick={payByBank} disabled={!!busy}
                className="w-full flex items-center justify-center gap-2 bg-cockpit-panel border border-cockpit-border text-cockpit-cream font-medium rounded-xl py-3 text-sm disabled:opacity-50">
                {busy === "bank" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />} Pay by bank transfer instead
              </button>
              <p className="text-[11px] text-cockpit-muted text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Secured by Stripe. We never store your card details.
              </p>
            </div>
          )}

          {/* Bank transfer instructions */}
          {bankReq && (
            <div className="mt-5 rounded-2xl bg-cockpit-panel border border-cockpit-border p-5">
              <p className="font-heading text-base font-bold text-cockpit-cream mb-3">Bank transfer</p>
              <Row label="Account name" value={bank?.accountName} />
              <Row label="Bank" value={bank?.bankName} />
              <Row label="IBAN" value={bank?.iban} />
              <Row label="SWIFT" value={bank?.swift} />
              <Row label="Amount" value={`$${meta.usd} (≈ R${meta.zarRef})`} />

              <div className="mt-4">
                <p className="text-[11px] text-cockpit-muted uppercase tracking-wider mb-1">Reference</p>
                <div className="flex items-center gap-2">
                  <span className="flex-1 font-heading text-2xl font-bold text-cockpit-amber tracking-wide">{bankReq.reference}</span>
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
