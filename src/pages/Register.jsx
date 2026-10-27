import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { AtSign, KeyRound, Eye, EyeOff, UserRound, ShieldCheck, Loader2, ArrowRight, Check, Plane } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import Seo from "@/components/Seo";
import Logo from "@/components/Logo";

const STEPS = [
  { n: "01", label: "Ground Check" },
  { n: "02", label: "Takeoff" },
  { n: "03", label: "Cruising" },
];

function Stepper({ active }) {
  return (
    <div className="relative mb-8">
      <div className="flex justify-between">
        {STEPS.map((s, i) => (
          <div key={s.n} className={`flex flex-col ${i === 0 ? "items-start" : i === STEPS.length - 1 ? "items-end" : "items-center"}`}>
            <span className={`font-mono text-xl font-bold ${i <= active ? "text-cockpit-amber" : "text-cockpit-muted/40"}`}>{s.n}</span>
            <span className={`text-[11px] tracking-widest uppercase font-semibold mt-1 ${i <= active ? "text-cockpit-cream" : "text-cockpit-muted/70"}`}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-3 left-0 right-0 -z-0 mx-10 border-t border-dashed border-cockpit-border" />
    </div>
  );
}

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { checkUserAuth } = useAuth();
  const nextPath = (() => { const n = params.get("next"); return n && n.startsWith("/") ? n : "/dashboard"; })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!agree) { setError("Please agree to the Terms and Privacy Policy to continue."); return; }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      if (fullName) { try { sessionStorage.setItem("ph_pending_name", fullName); } catch (_) {} }
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) base44.auth.setToken(result.access_token);
      await checkUserAuth();
      navigate(nextPath);
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen font-body text-cockpit-cream"
      style={{ background: "radial-gradient(120% 60% at 100% 0%, rgba(255,157,46,0.12) 0%, #0A0E17 45%)", backgroundColor: "#0A0E17" }}>
      <Seo noindex title="Create account — PilotHobb" description="Create your PilotHobb pilot account." />
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 h-16 max-w-lg mx-auto">
        <Link to="/" className="flex items-center">
          <Logo size={32} />
        </Link>
        <span className="inline-flex items-center gap-1.5 bg-cockpit-panel border border-cockpit-border text-cockpit-muted text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
          <Plane className="w-3.5 h-3.5 text-cockpit-amber" /> {showOtp ? "Takeoff" : "Pre-Flight"} Mode
        </span>
      </div>

      <div className="max-w-lg mx-auto px-5 pb-16">
        <Stepper active={showOtp ? 1 : 0} />

        {error && <div className="mb-5 p-3 rounded-xl bg-cockpit-expired/10 text-cockpit-expired text-sm">{error}</div>}

        {!showOtp ? (
          <form onSubmit={handleSubmit}>
            <h1 className="font-heading text-[36px] leading-tight font-bold mb-3">Pre-Flight Briefing</h1>
            <p className="text-cockpit-muted leading-relaxed mb-8">Prepare your pilot profile for active operations. Verification ensures regulatory compliance for global flight logging.</p>

            {/* Identity card */}
            <div className="bg-cockpit-panel rounded-2xl border border-cockpit-border shadow-sm p-6 mb-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-cockpit-amber/10 flex items-center justify-center"><UserRound className="w-6 h-6 text-cockpit-amber" /></div>
                <h2 className="font-heading text-xl font-bold">Aviator Identity</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase font-bold text-cockpit-muted mb-2">Legal Callsign (Full Name)</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Captain John Doe" autoFocus
                    className="w-full px-4 py-3.5 rounded-xl border border-cockpit-border bg-cockpit-bg/60 text-cockpit-cream placeholder-cockpit-muted/60 focus:outline-none focus:ring-2 focus:ring-cockpit-amber/40 focus:border-cockpit-amber" />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase font-bold text-cockpit-muted mb-2">Comm Channel (Email)</label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-cockpit-muted" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@aviator.io"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-cockpit-border bg-cockpit-bg/60 text-cockpit-cream placeholder-cockpit-muted/60 focus:outline-none focus:ring-2 focus:ring-cockpit-amber/40 focus:border-cockpit-amber" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase font-bold text-cockpit-muted mb-2">Logbook Key (Password)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-cockpit-muted" />
                    <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-cockpit-border bg-cockpit-bg/60 text-cockpit-cream placeholder-cockpit-muted/60 focus:outline-none focus:ring-2 focus:ring-cockpit-amber/40 focus:border-cockpit-amber" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cockpit-muted hover:text-cockpit-cream">
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security card */}
            <div className="bg-cockpit-panel-light text-cockpit-cream rounded-2xl border border-cockpit-border p-6 mb-5 relative overflow-hidden">
              <ShieldCheck className="absolute -right-3 -bottom-3 w-28 h-28 text-cockpit-cream/5" />
              <p className="text-[11px] tracking-widest uppercase font-bold text-cockpit-amber mb-1">Secure Protocol</p>
              <h3 className="font-heading text-xl font-bold mb-2">Biometric &amp; Data Encryption</h3>
              <p className="text-cockpit-cream/65 text-sm leading-relaxed">Your credentials are stored in an AES-256 encrypted vault, accessible only for flight authority verification.</p>
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 bg-cockpit-panel rounded-2xl border border-cockpit-border p-4 mb-6 cursor-pointer select-none">
              <button type="button" onClick={() => setAgree(!agree)}
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${agree ? "bg-cockpit-amber border-cockpit-amber" : "bg-cockpit-bg border-cockpit-border"}`}>
                {agree && <Check className="w-4 h-4 text-cockpit-bg" />}
              </button>
              <span className="text-sm text-cockpit-muted leading-relaxed">I agree to the <Link to="/terms" target="_blank" onClick={(e) => e.stopPropagation()} className="text-cockpit-amber font-semibold underline">Terms</Link> and <Link to="/privacy" target="_blank" onClick={(e) => e.stopPropagation()} className="text-cockpit-amber font-semibold underline">Privacy Policy</Link>.</span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-cockpit-amber text-cockpit-bg font-bold shadow-lg shadow-cockpit-amber/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Preparing…</> : <>Begin Pre-Flight <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-center text-sm text-cockpit-muted mt-6">
              Already cleared?{" "}
              <Link to="/login" className="font-bold text-cockpit-amber hover:underline">Log in</Link>
            </p>
          </form>
        ) : (
          <div>
            <h1 className="font-heading text-[36px] leading-tight font-bold mb-3">Verify Takeoff</h1>
            <p className="text-cockpit-muted leading-relaxed mb-8">We sent a 6-digit clearance code to <span className="font-semibold text-cockpit-cream">{email}</span>. Enter it to complete your pre-flight.</p>
            <div className="bg-cockpit-panel rounded-2xl border border-cockpit-border shadow-sm p-6">
              <div className="flex justify-center mb-6">
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <button onClick={handleVerify} disabled={loading || otpCode.length < 6}
                className="w-full py-4 rounded-xl bg-cockpit-amber text-cockpit-bg font-bold shadow-lg shadow-cockpit-amber/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying…</> : <>Clear for Takeoff <Plane className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-sm text-cockpit-muted mt-4">
                Didn't receive it?{" "}
                <button onClick={handleResend} className="font-bold text-cockpit-amber hover:underline">Resend</button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}