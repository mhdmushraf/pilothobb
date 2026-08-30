import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { AtSign, KeyRound, Eye, EyeOff, UserRound, ShieldCheck, Loader2, ArrowRight, Check, Plane } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import Seo from "@/components/Seo";
import { BRAND_ASSETS } from "@/components/Logo";

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
            <span className={`font-mono text-xl font-bold ${i <= active ? "text-[#4f46e5]" : "text-[#c7c4d8]"}`}>{s.n}</span>
            <span className={`text-[11px] tracking-widest uppercase font-semibold mt-1 ${i <= active ? "text-[#191c1e]" : "text-[#9aa0ae]"}`}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-3 left-0 right-0 -z-0 mx-10 border-t border-dashed border-[#c7c4d8]" />
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
    <div className="min-h-screen font-body text-[#191c1e]"
      style={{ background: "radial-gradient(120% 60% at 100% 0%, #eceafe 0%, #f7f9fb 45%)", backgroundColor: "#f7f9fb" }}>
      <Seo noindex title="Create account — PilotHobb" description="Create your PilotHobb pilot account." />
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 h-16 max-w-lg mx-auto">
        <Link to="/" className="flex items-center">
          <img src={BRAND_ASSETS.logo} alt="PilotHobb" className="h-8 w-auto" />
        </Link>
        <span className="inline-flex items-center gap-1.5 bg-[#eceef0] text-[#464555] text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
          <Plane className="w-3.5 h-3.5 text-[#4f46e5]" /> {showOtp ? "Takeoff" : "Pre-Flight"} Mode
        </span>
      </div>

      <div className="max-w-lg mx-auto px-5 pb-16">
        <Stepper active={showOtp ? 1 : 0} />

        {error && <div className="mb-5 p-3 rounded-xl bg-[#ef4444]/10 text-[#b91c1c] text-sm">{error}</div>}

        {!showOtp ? (
          <form onSubmit={handleSubmit}>
            <h1 className="font-heading text-[36px] leading-tight font-bold mb-3">Pre-Flight Briefing</h1>
            <p className="text-[#464555] leading-relaxed mb-8">Prepare your pilot profile for active operations. Verification ensures regulatory compliance for global flight logging.</p>

            {/* Identity card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 mb-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#4f46e5]/10 flex items-center justify-center"><UserRound className="w-6 h-6 text-[#4f46e5]" /></div>
                <h2 className="font-heading text-xl font-bold">Aviator Identity</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase font-bold text-[#464555] mb-2">Legal Callsign (Full Name)</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Captain John Doe" autoFocus
                    className="w-full px-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-white placeholder-[#9aa0ae] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 focus:border-[#4f46e5]" />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase font-bold text-[#464555] mb-2">Comm Channel (Email)</label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9aa0ae]" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@aviator.io"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-white placeholder-[#9aa0ae] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 focus:border-[#4f46e5]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase font-bold text-[#464555] mb-2">Logbook Key (Password)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9aa0ae]" />
                    <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-[#e2e8f0] bg-white placeholder-[#9aa0ae] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 focus:border-[#4f46e5]" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa0ae] hover:text-[#464555]">
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security card */}
            <div className="bg-[#0f172a] text-white rounded-2xl p-6 mb-5 relative overflow-hidden">
              <ShieldCheck className="absolute -right-3 -bottom-3 w-28 h-28 text-white/5" />
              <p className="text-[11px] tracking-widest uppercase font-bold text-[#8b8ff5] mb-1">Secure Protocol</p>
              <h3 className="font-heading text-xl font-bold mb-2">Biometric &amp; Data Encryption</h3>
              <p className="text-white/60 text-sm leading-relaxed">Your credentials are stored in an AES-256 encrypted vault, accessible only for flight authority verification.</p>
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 bg-white rounded-2xl border border-[#e2e8f0] p-4 mb-6 cursor-pointer select-none">
              <button type="button" onClick={() => setAgree(!agree)}
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${agree ? "bg-[#4f46e5] border-[#4f46e5]" : "bg-white border-[#c7c4d8]"}`}>
                {agree && <Check className="w-4 h-4 text-white" />}
              </button>
              <span className="text-sm text-[#464555] leading-relaxed">I agree to the <Link to="/terms" target="_blank" onClick={(e) => e.stopPropagation()} className="text-[#4f46e5] font-semibold underline">Terms</Link> and <Link to="/privacy" target="_blank" onClick={(e) => e.stopPropagation()} className="text-[#4f46e5] font-semibold underline">Privacy Policy</Link>.</span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-[#4f46e5] text-white font-bold shadow-lg shadow-[#4f46e5]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Preparing…</> : <>Begin Pre-Flight <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-center text-sm text-[#464555] mt-6">
              Already cleared?{" "}
              <Link to="/login" className="font-bold text-[#4f46e5] hover:underline">Log in</Link>
            </p>
          </form>
        ) : (
          <div>
            <h1 className="font-heading text-[36px] leading-tight font-bold mb-3">Verify Takeoff</h1>
            <p className="text-[#464555] leading-relaxed mb-8">We sent a 6-digit clearance code to <span className="font-semibold text-[#191c1e]">{email}</span>. Enter it to complete your pre-flight.</p>
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
              <div className="flex justify-center mb-6">
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <button onClick={handleVerify} disabled={loading || otpCode.length < 6}
                className="w-full py-4 rounded-xl bg-[#4f46e5] text-white font-bold shadow-lg shadow-[#4f46e5]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying…</> : <>Clear for Takeoff <Plane className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-sm text-[#464555] mt-4">
                Didn't receive it?{" "}
                <button onClick={handleResend} className="font-bold text-[#4f46e5] hover:underline">Resend</button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
