import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { AtSign, KeyRound, Eye, EyeOff, Rocket, Loader2, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";
import Logo from "@/components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      await checkUserAuth();
      setVerified(true);
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 font-body text-cockpit-cream"
      style={{ background: "radial-gradient(120% 80% at 50% -5%, rgba(255,157,46,0.12) 0%, #0A0E17 55%)" }}>
      <Seo noindex title="Login — PilotHobb" description="Log in to PilotHobb." />
      <div className="relative w-full max-w-md">
        <div className="bg-cockpit-panel/90 backdrop-blur rounded-3xl border border-cockpit-border shadow-2xl shadow-black/40 p-8">
          {/* Brand */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo size={40} />
            </div>
            <p className="text-[12px] tracking-[0.25em] text-cockpit-muted font-semibold uppercase">Aviation Intelligence</p>
          </div>

          {verified ? (
            <div className="rounded-2xl bg-cockpit-valid text-cockpit-bg p-5 flex items-center gap-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8 shrink-0" />
              <div>
                <p className="font-bold text-lg leading-tight">Identity Verified</p>
                <p className="text-cockpit-bg/80 text-sm">Clear for takeoff. Redirecting…</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-cockpit-muted text-sm mb-6">Access your flight operations.</p>
              {error && <div className="mb-4 p-3 rounded-xl bg-cockpit-expired/10 text-cockpit-expired text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-cockpit-cream mb-1.5">Aviator Email</label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-cockpit-muted" />
                    <input type="email" autoComplete="email" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@airline.com"
                      className="w-full h-13 pl-11 pr-4 py-3.5 rounded-xl border border-cockpit-border bg-cockpit-bg/60 text-cockpit-cream placeholder-cockpit-muted/60 focus:outline-none focus:ring-2 focus:ring-cockpit-amber/40 focus:border-cockpit-amber" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-cockpit-cream">Logbook Key</label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-cockpit-amber hover:underline">Forgot Key?</Link>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-cockpit-muted" />
                    <input type={showPw ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-13 pl-11 pr-11 py-3.5 rounded-xl border border-cockpit-border bg-cockpit-bg/60 text-cockpit-cream placeholder-cockpit-muted/60 focus:outline-none focus:ring-2 focus:ring-cockpit-amber/40 focus:border-cockpit-amber" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cockpit-muted hover:text-cockpit-cream">
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                  <button type="button" onClick={() => setRemember(!remember)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${remember ? "bg-cockpit-amber border-cockpit-amber" : "bg-cockpit-bg border-cockpit-border"}`}>
                    {remember && <CheckCircle2 className="w-4 h-4 text-cockpit-bg" />}
                  </button>
                  <span className="text-sm text-cockpit-muted">Remember this terminal</span>
                </label>

                <button type="submit" disabled={loading}
                  className="w-full h-13 py-4 rounded-xl bg-cockpit-amber text-cockpit-bg font-bold shadow-lg shadow-cockpit-amber/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Initiating…</> : <>Initiate Session <Rocket className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="text-center text-sm text-cockpit-muted mt-6">
                New operator?{" "}
                <Link to="/register" className="font-bold text-cockpit-amber hover:underline">Apply for credentials</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}