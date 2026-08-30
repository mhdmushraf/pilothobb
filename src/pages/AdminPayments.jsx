import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Loader2, Check, X, ExternalLink, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";

const money = (n) => `R${Number(n || 0).toLocaleString("en-ZA")}`;
const planLabel = (p) => ({ cpl_annual: "CPL Annual", cpl_monthly: "CPL Monthly", school: "School" }[p] || p || "—");

export default function AdminPayments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  const [pilots, setPilots] = useState({});
  const [busyId, setBusyId] = useState("");
  const [rejectId, setRejectId] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  const isAdmin = user?.role === "admin";

  const load = useCallback(async () => {
    try {
      const list = await base44.entities.PaymentRequest.list("-created_date", 200);
      setRows(list);
      const ids = [...new Set(list.map((r) => r.pilot_id).filter(Boolean))];
      if (ids.length) {
        const ps = await base44.entities.Pilot.list("-created_date", 500);
        const map = {};
        ps.forEach((p) => { map[p.id] = p.full_name; });
        setPilots(map);
      }
    } catch (e) {
      setErr(e.message || "Failed to load payments.");
      setRows([]);
    }
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const act = async (id, action, adminNote) => {
    setBusyId(id); setErr("");
    try {
      const res = await base44.functions.invoke("adminSetPaymentStatus", { id, action, admin_note: adminNote });
      if (res?.error) throw new Error(res.error);
      setRejectId(""); setNote("");
      await load();
    } catch (e) {
      setErr(e.message || "Action failed.");
    } finally { setBusyId(""); }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cockpit-bg flex flex-col items-center justify-center px-6 text-center">
        <ShieldCheck className="w-10 h-10 text-cockpit-muted mb-3" />
        <p className="text-cockpit-cream font-semibold">Admin access only</p>
        <p className="text-sm text-cockpit-muted mt-1">You don't have permission to view this page.</p>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-sm text-cockpit-amber font-semibold">Back to dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cockpit-bg px-4 pt-6 pb-24 max-w-3xl mx-auto">
      <Seo noindex title="Payments — Admin" description="PilotHobb payment requests." />
      <h1 className="font-heading text-2xl font-bold text-cockpit-cream mb-1">Payment requests</h1>
      <p className="text-xs text-cockpit-muted mb-5">Newest first · mark bank transfers paid to activate plans.</p>

      {err && <p className="text-xs text-cockpit-expired mb-3">{err}</p>}

      {rows === null ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-cockpit-amber animate-spin" /></div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-cockpit-muted text-center py-16">No payment requests yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-cockpit-cream truncate">{pilots[r.pilot_id] || "Unknown pilot"}</p>
                  <p className="text-xs text-cockpit-muted mt-0.5">{planLabel(r.plan)} · {money(r.amount_zar)} · {r.method === "bank_transfer" ? "Bank transfer" : "Card"}</p>
                  <p className="text-xs font-mono text-cockpit-amber mt-1">{r.reference || "—"}</p>
                </div>
                <span className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full ${
                  r.status === "paid" ? "bg-cockpit-valid/15 text-cockpit-valid"
                    : r.status === "rejected" ? "bg-cockpit-expired/15 text-cockpit-expired"
                    : "bg-cockpit-amber/15 text-cockpit-amber"}`}>{r.status}</span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                {r.proof_url && (
                  <a href={r.proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cockpit-glow-blue">
                    <ExternalLink className="w-3.5 h-3.5" /> Proof
                  </a>
                )}
                {r.admin_note && <span className="text-[11px] text-cockpit-muted italic truncate">{r.admin_note}</span>}
              </div>

              {r.status === "pending" && (
                <>
                  {rejectId === r.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason (optional)"
                        className="w-full text-sm rounded-lg bg-cockpit-panel-light border border-cockpit-border text-cockpit-cream p-2" rows={2} />
                      <div className="flex gap-2">
                        <button onClick={() => act(r.id, "reject", note)} disabled={busyId === r.id}
                          className="flex-1 rounded-lg bg-cockpit-expired/15 border border-cockpit-expired/40 text-cockpit-expired text-sm font-semibold py-2 disabled:opacity-50">
                          {busyId === r.id ? "…" : "Confirm reject"}
                        </button>
                        <button onClick={() => { setRejectId(""); setNote(""); }} className="px-3 rounded-lg border border-cockpit-border text-cockpit-muted text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => act(r.id, "paid")} disabled={busyId === r.id}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-cockpit-valid/15 border border-cockpit-valid/40 text-cockpit-valid text-sm font-semibold py-2 disabled:opacity-50">
                        {busyId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Mark paid
                      </button>
                      <button onClick={() => { setRejectId(r.id); setNote(""); }} disabled={busyId === r.id}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-cockpit-panel-light border border-cockpit-border text-cockpit-muted text-sm font-semibold py-2 disabled:opacity-50">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
