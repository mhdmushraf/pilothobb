import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import usePilot from "@/hooks/usePilot";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Seo from "@/components/Seo";
import { PRICES } from "@/lib/plan";

const TOTAL_STEPS = 6;

const TRACK_OPTIONS = [
  "Flight hours",
  "Documents & currency",
  "Theory exams",
  "Fleet & maintenance",
  "RPAS / Drone",
  "Career summary",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { pilot, loading } = usePilot();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("next");

  const [fullName, setFullName] = useState("");
  const [authority, setAuthority] = useState("");
  const [licenceType, setLicenceType] = useState("");
  const [homeAerodrome, setHomeAerodrome] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [englishValidUntil, setEnglishValidUntil] = useState("");
  const [tracking, setTracking] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [plan, setPlan] = useState("annual");
  const [trialBusy, setTrialBusy] = useState(false);

  // prefill once the pilot record is available
  useEffect(() => {
    if (pilot) {
      setFullName(pilot.full_name || "");
      setAuthority(pilot.authority || "");
      setLicenceType(pilot.licence_type || "");
      setHomeAerodrome(pilot.home_aerodrome || "");
      setEnglishLevel(
        pilot.english_level != null ? String(pilot.english_level) : ""
      );
      setEnglishValidUntil(pilot.english_valid_until || "");
    }
  }, [pilot]);

  const toggleTracking = (label) => {
    setTracking((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const goNext = () => {
    setDirection("next");
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };
  const goBack = () => {
    setDirection("back");
    setStep((s) => Math.max(0, s - 1));
  };

  const canContinue = () => {
    if (step === 0) return fullName.trim().length > 0;
    if (step === 1) return !!authority && !!licenceType;
    return true;
  };

  const saveProfile = async () => {
    setSubmitting(true);
    try {
      await base44.entities.Pilot.update(pilot.id, {
        full_name: fullName.trim(),
        authority,
        licence_type: licenceType,
        home_aerodrome: homeAerodrome || undefined,
        english_level: Number(englishLevel) || undefined,
        english_valid_until: englishValidUntil || undefined,
        onboarded: true,
      });
      setSubmitting(false);
      return true;
    } catch (e) {
      console.error("Onboarding failed", e);
      setSubmitting(false);
      return false;
    }
  };

  const startTrial = async () => {
    setTrialBusy(true);
    try {
      const res = await base44.functions.invoke("stripeCreateCheckout", {
        plan: plan === "annual" ? "cpl_annual" : "cpl_monthly",
      });
      const url = res?.data?.url ?? res?.url;
      if (url) { window.location.href = url; return; }
      setTrialBusy(false);
      navigate("/quicklog?first=1");
    } catch {
      setTrialBusy(false);
      navigate("/quicklog?first=1");
    }
  };

  const skipTrial = () => navigate("/quicklog?first=1");

  const fadeIn = direction === "next" ? "ob-fade-next" : "ob-fade-back";

  return (
    <div
      className="min-h-screen w-full overflow-y-auto relative flex flex-col items-center px-4 py-8 pb-28"
      style={{
        background:
          "radial-gradient(120% 60% at 50% -10%, rgba(79,70,229,.10), transparent 55%), #F7F9FB",
      }}
    >
      <Seo noindex title="PilotHobb" description="PilotHobb digital pilot logbook." />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size={42} />
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? "bg-cockpit-amber" : "bg-cockpit-border"
              }`}
            />
          ))}
        </div>

        {/* Step card */}
        <div className="ph-card p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-4 border-cockpit-border border-t-cockpit-amber rounded-full animate-spin" />
            </div>
          ) : (
            <div key={step} className={fadeIn}>
              {step === 0 && (
                <Step
                  title="Welcome to PilotHobb"
                  subtitle="Let's set up your logbook"
                >
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-cockpit-muted">
                      Full name
                    </Label>
                    <Input
                      id="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="rounded-2xl bg-cockpit-bg border-cockpit-border text-cockpit-cream"
                    />
                  </div>
                </Step>
              )}

              {step === 1 && (
                <Step
                  title="Your credentials"
                  subtitle="Tell us about your licence"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-cockpit-muted">Authority</Label>
                      <Select value={authority} onValueChange={setAuthority}>
                        <SelectTrigger className="rounded-2xl bg-cockpit-bg border-cockpit-border text-cockpit-cream">
                          <SelectValue placeholder="Select authority" />
                        </SelectTrigger>
                        <SelectContent className="bg-cockpit-panel border-cockpit-border text-cockpit-cream">
                          {["FAA", "EASA", "UK CAA", "SACAA", "CASA", "Other"].map(
                            (a) => (
                              <SelectItem key={a} value={a}>
                                {a}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-cockpit-muted">Licence type</Label>
                      <Select value={licenceType} onValueChange={setLicenceType}>
                        <SelectTrigger className="rounded-2xl bg-cockpit-bg border-cockpit-border text-cockpit-cream">
                          <SelectValue placeholder="Select licence type" />
                        </SelectTrigger>
                        <SelectContent className="bg-cockpit-panel border-cockpit-border text-cockpit-cream">
                          {["Student", "PPL", "CPL", "ATPL", "RPL"].map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Step>
              )}

              {step === 2 && (
                <Step
                  title="Base & language"
                  subtitle="Optional, but useful for currency reminders"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-cockpit-muted">Home aerodrome</Label>
                      <Input
                        value={homeAerodrome}
                        onChange={(e) => setHomeAerodrome(e.target.value)}
                        placeholder="e.g. FAGM"
                        className="rounded-2xl bg-cockpit-bg border-cockpit-border text-cockpit-cream font-mono uppercase tracking-wide"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-cockpit-muted">English level</Label>
                        <Input
                          type="number"
                          min={1}
                          max={6}
                          value={englishLevel}
                          onChange={(e) => setEnglishLevel(e.target.value)}
                          placeholder="1–6"
                          className="rounded-2xl bg-cockpit-bg border-cockpit-border text-cockpit-cream font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-cockpit-muted">Valid until</Label>
                        <Input
                          type="date"
                          value={englishValidUntil}
                          onChange={(e) => setEnglishValidUntil(e.target.value)}
                          className="rounded-2xl bg-cockpit-bg border-cockpit-border text-cockpit-cream font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </Step>
              )}

              {step === 3 && (
                <Step
                  title="What do you want to track?"
                  subtitle="Pick anything that matters to you"
                >
                  <div className="flex flex-wrap gap-2">
                    {TRACK_OPTIONS.map((opt) => {
                      const active = tracking.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleTracking(opt)}
                          className={`rounded-full px-4 py-2 text-sm border transition-all duration-200 ${
                            active
                              ? "ph-chip-active border-transparent"
                              : "bg-cockpit-panel-light text-cockpit-muted border-cockpit-border hover:border-cockpit-amber/60"
                          }`}
                        >
                          {active && <Check className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </Step>
              )}

              {step === 4 && (
                <Step title="Review & finish" subtitle="Confirm your details">
                  <div className="space-y-3 text-sm">
                    <ReviewRow label="Full name" value={fullName} />
                    <ReviewRow label="Authority" value={authority} />
                    <ReviewRow label="Licence" value={licenceType} />
                    <ReviewRow
                      label="Home aerodrome"
                      value={homeAerodrome || "—"}
                    />
                    <ReviewRow
                      label="English level"
                      value={englishLevel ? `${englishLevel} / 6` : "—"}
                    />
                    <ReviewRow
                      label="English valid until"
                      value={englishValidUntil || "—"}
                    />
                    <ReviewRow
                      label="Tracking"
                      value={tracking.length ? tracking.join(", ") : "—"}
                    />
                  </div>
                </Step>
              )}

              {step === 5 && (
                <Step
                  title="Start your free trial"
                  subtitle="5 days free · cancel anytime before it ends and you won't be charged"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {["annual", "monthly"].map((p) => {
                      const active = plan === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlan(p)}
                          className={`text-left rounded-2xl p-4 border transition-all ${active ? "border-cockpit-amber bg-cockpit-amber/10 ring-1 ring-cockpit-amber/40" : "bg-cockpit-panel-light border-cockpit-border"}`}
                        >
                          <p className="text-[13px] text-cockpit-muted">{p === "annual" ? "CPL Annual" : "CPL Monthly"}</p>
                          <p className="font-heading text-xl font-bold text-cockpit-cream mt-0.5">{p === "annual" ? PRICES.annualLabel : PRICES.monthlyLabel}</p>
                          <p className="text-[11px] text-cockpit-muted mt-0.5">{p === "annual" ? "Best value" : "Billed monthly"}</p>
                          {active && <Check className="w-4 h-4 text-cockpit-amber mt-2" />}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={startTrial}
                    disabled={trialBusy}
                    className="mt-4 w-full ph-btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ height: "3rem" }}
                  >
                    {trialBusy ? "Starting…" : "Start 5-day free trial"}
                  </button>
                  <p className="text-[11px] text-cockpit-muted text-center mt-2">
                    Card required · charged {plan === "annual" ? PRICES.annualLabel : PRICES.monthlyLabel} after 5 days · cancel anytime
                  </p>
                  <button onClick={skipTrial} className="mt-3 w-full text-sm text-cockpit-muted hover:text-cockpit-cream py-1">
                    I'll start with the free plan
                  </button>
                </Step>
              )}
            </div>
          )}

          {/* Nav buttons */}
          {!loading && (
            <div className="flex items-center gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={step === 0}
                className="ph-btn-ghost disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {step < 4 ? (
                <Button
                  onClick={goNext}
                  disabled={!canContinue()}
                  className="flex-1 ph-btn-primary"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : step === 4 ? (
                <Button
                  onClick={async () => { const ok = await saveProfile(); if (ok) goNext(); }}
                  disabled={submitting}
                  className="flex-1 ph-btn-primary"
                >
                  {submitting ? "Saving…" : "Continue"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ob-fade-next { animation: obFadeNext .35s ease-out; }
        .ob-fade-back { animation: obFadeBack .35s ease-out; }
        @keyframes obFadeNext {
          from { opacity: 0; transform: translateX(18px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes obFadeBack {
          from { opacity: 0; transform: translateX(-18px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .ph-btn-primary {
          background: linear-gradient(180deg, #6366F1, #4F46E5);
          color: #F7F9FB;
          border: none;
          box-shadow: 0 4px 16px rgba(79,70,229,0.3);
          font-weight: 600;
          border-radius: 0.75rem;
          height: 2.75rem;
        }
        .ph-btn-primary:hover { filter: brightness(1.05); }
        .ph-btn-primary:disabled { opacity: 0.5; }
        .ph-btn-ghost {
          background: #F2F4F6;
          border: 1px solid #E2E8F0;
          color: #6B7280;
          border-radius: 0.75rem;
          height: 2.75rem;
        }
        .ph-btn-ghost:hover { color: #191C1E; }
        .ph-chip-active {
          background: linear-gradient(180deg, #6366F1, #4F46E5);
          color: #F7F9FB;
          border-color: transparent;
        }
      `}</style>
    </div>
  );
}

function Step({ title, subtitle, children }) {
  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-cockpit-cream">{title}</h2>
      {subtitle && <p className="text-cockpit-muted text-sm mt-1 mb-5">{subtitle}</p>}
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-cockpit-border last:border-0">
      <span className="text-cockpit-muted">{label}</span>
      <span className="text-cockpit-cream text-right font-medium">{value}</span>
    </div>
  );
}