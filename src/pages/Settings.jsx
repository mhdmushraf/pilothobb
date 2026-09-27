import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Save, LogOut, BarChart3, Trash2, KeyRound, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import usePilot from "@/hooks/usePilot";
import SkeletonCard from "@/components/SkeletonCard";
import AppHeader from "@/components/AppHeader";
import SectionTitle from "@/components/SectionTitle";
import ProfilePhoto from "@/components/ProfilePhoto";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";

const AUTHORITIES = ["FAA", "EASA", "UK CAA", "SACAA", "CASA", "Other"];
const LICENCE_TYPES = ["Student", "PPL", "CPL", "ATPL"];

export default function Settings() {
  const { pilot, loading, reload } = usePilot();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwErr, setPwErr] = useState("");

  useEffect(() => {
    if (pilot) {
      setForm({
        full_name: pilot.full_name || "",
        authority: pilot.authority || "",
        licence_type: pilot.licence_type || "",
        english_level: pilot.english_level ?? "",
        english_valid_until: pilot.english_valid_until || "",
        home_aerodrome: pilot.home_aerodrome || "",
      });
    }
  }, [pilot]);

  const handleSave = async () => {
    if (!form || !pilot) return;
    setSaving(true);
    try {
      await base44.entities.Pilot.update(pilot.id, {
        full_name: form.full_name,
        authority: form.authority || undefined,
        licence_type: form.licence_type || undefined,
        english_level: form.english_level !== "" ? Number(form.english_level) : undefined,
        english_valid_until: form.english_valid_until || undefined,
        home_aerodrome: form.home_aerodrome || undefined,
      });
      toast({ title: "Profile saved" });
      reload();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwErr("");
    if (!pw.current || !pw.next) { setPwErr("Please fill in all fields."); return; }
    if (pw.next.length < 8) { setPwErr("New password must be at least 8 characters."); return; }
    if (pw.next !== pw.confirm) { setPwErr("New passwords don't match."); return; }
    setPwSaving(true);
    try {
      await base44.auth.changePassword({ currentPassword: pw.current, newPassword: pw.next });
      toast({ title: "Password updated" });
      setPw({ current: "", next: "", confirm: "" });
    } catch (e) {
      setPwErr(e?.message || "Couldn't update password. Check your current password and try again.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout("/login");
  };

  const handleAccountDeleted = () => {
    base44.auth.logout("/login");
  };

  if (loading || !form) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <SkeletonCard lines={5} />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <AppHeader icon={SettingsIcon} title="Settings" />

      <ProfilePhoto pilot={pilot} onUpdated={reload} />

      {/* Plan / upgrade */}
      {(() => {
        const paid = pilot.plan === "cpl" || pilot.plan === "school";
        const st = pilot.subscription_status || "none";
        const onPlan = paid || ["trialing", "active", "canceling"].includes(st);
        return onPlan ? (
          <button onClick={() => navigate("/upgrade")}
            className="w-full mb-5 flex items-center gap-3 rounded-2xl bg-cockpit-panel border border-cockpit-valid/40 p-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-cockpit-valid/10 border border-cockpit-valid/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-cockpit-valid" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-cockpit-cream">
                {st === "trialing" ? "Free trial active" : st === "canceling" ? "Subscription ending" : "PilotHobb CPL"}
              </p>
              <p className="text-xs text-cockpit-muted">Tap to manage your plan</p>
            </div>
            <ChevronRight className="w-4 h-4 text-cockpit-muted" />
          </button>
        ) : (
          <button onClick={() => navigate("/upgrade")}
            className="w-full mb-5 flex items-center gap-3 rounded-2xl p-4 text-left text-white"
            style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)", boxShadow: "0 10px 26px rgba(79,70,229,.28)" }}>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Unlock PilotHobb CPL</p>
              <p className="text-xs text-white/85">Start your 5-day free trial — unlimited logging & exports</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/90" />
          </button>
        );
      })()}

      <div className="space-y-4">
        <div>
          <label className="text-xs text-cockpit-muted mb-1 block">Full Name</label>
          <Input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="bg-cockpit-panel border-cockpit-border text-cockpit-cream"
          />
        </div>

        <div>
          <label className="text-xs text-cockpit-muted mb-1 block">Authority</label>
          <Select value={form.authority} onValueChange={(v) => setForm({ ...form, authority: v })}>
            <SelectTrigger className="bg-cockpit-panel border-cockpit-border text-cockpit-cream">
              <SelectValue placeholder="Select authority" />
            </SelectTrigger>
            <SelectContent className="bg-cockpit-panel border-cockpit-border">
              {AUTHORITIES.map((a) => (
                <SelectItem key={a} value={a} className="text-cockpit-cream">{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-cockpit-muted mb-1 block">Licence Type</label>
          <Select value={form.licence_type} onValueChange={(v) => setForm({ ...form, licence_type: v })}>
            <SelectTrigger className="bg-cockpit-panel border-cockpit-border text-cockpit-cream">
              <SelectValue placeholder="Select licence type" />
            </SelectTrigger>
            <SelectContent className="bg-cockpit-panel border-cockpit-border">
              {LICENCE_TYPES.map((l) => (
                <SelectItem key={l} value={l} className="text-cockpit-cream">{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-cockpit-muted mb-1 block">English Level (1-6)</label>
            <Input
              type="number"
              min={1}
              max={6}
              value={form.english_level}
              onChange={(e) => setForm({ ...form, english_level: e.target.value })}
              className="bg-cockpit-panel border-cockpit-border text-cockpit-cream font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-cockpit-muted mb-1 block">English Valid Until</label>
            <Input
              type="date"
              value={form.english_valid_until}
              onChange={(e) => setForm({ ...form, english_valid_until: e.target.value })}
              className="bg-cockpit-panel border-cockpit-border text-cockpit-cream font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-cockpit-muted mb-1 block">Home Aerodrome</label>
          <Input
            value={form.home_aerodrome}
            onChange={(e) => setForm({ ...form, home_aerodrome: e.target.value })}
            className="bg-cockpit-panel border-cockpit-border text-cockpit-cream font-mono"
            placeholder="e.g. FAGG"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-cockpit-amber text-cockpit-bg hover:bg-cockpit-amber/90 font-semibold rounded-xl h-12"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving…" : "Save Profile"}
        </Button>

        {/* Running totals (read-only) */}
        <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 mt-6">
          <SectionTitle icon={BarChart3}>Running Totals</SectionTitle>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Total Time", pilot.total_time],
              ["PIC", pilot.total_pic],
              ["Dual", pilot.total_dual],
              ["Cross-country", pilot.total_xc],
              ["Night", pilot.total_night],
              ["Instrument", pilot.total_instrument],
              ["Landings", pilot.total_landings],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <span className="text-cockpit-muted">{label}</span>
                <span className="font-mono font-bold text-cockpit-cream">{(val ?? 0).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Change password */}
        <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-4 mt-6">
          <SectionTitle icon={KeyRound}>Change password</SectionTitle>
          <div className="space-y-3">
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Current password"
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream"
            />
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="New password"
              value={pw.next}
              onChange={(e) => setPw({ ...pw, next: e.target.value })}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream"
            />
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream"
            />
            {pwErr && <p className="text-xs text-cockpit-expired">{pwErr}</p>}
            <Button
              onClick={handleChangePassword}
              disabled={pwSaving}
              className="w-full bg-cockpit-panel-light border border-cockpit-border text-cockpit-cream hover:bg-cockpit-border/40 rounded-xl h-11"
            >
              <KeyRound className="w-4 h-4 mr-2" /> {pwSaving ? "Updating…" : "Update password"}
            </Button>
            <p className="text-[11px] text-cockpit-muted">
              Forgot your current password? <a href="/forgot-password" className="text-cockpit-amber hover:underline">Reset via email</a>.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-cockpit-muted hover:text-cockpit-expired mt-4"
        >
          <LogOut className="w-4 h-4 mr-2" /> Log out
        </Button>

        <div className="rounded-2xl border border-cockpit-expired/20 bg-cockpit-expired/5 p-4 mt-6">
          <p className="text-sm font-semibold text-cockpit-cream mb-1">Delete account</p>
          <p className="text-xs text-cockpit-muted mb-3">
            Permanently remove your account and all flight data. This cannot be undone.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowDelete(true)}
            className="w-full border-cockpit-expired/40 text-cockpit-expired hover:bg-cockpit-expired/10"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete my account
          </Button>
        </div>
      </div>

      {showDelete && (
        <DeleteAccountDialog
          onClose={() => setShowDelete(false)}
          onDeleted={handleAccountDeleted}
        />
      )}
    </div>
  );
}