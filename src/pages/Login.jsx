import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { AtSign, KeyRound, Eye, EyeOff, Rocket, Loader2, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";
import { BRAND_ASSETS } from "@/components/Logo";

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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 font-body text-[#191c1e]"
      style={{ background: "radial-gradient(120% 80% at 50% -5%, #eceafe 0%, #f7f9fb 55%)" }}>
      <Seo noindex title="Login — PilotHobb" description="Log in to PilotHobb." />
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur rounded-3xl border border-[#e2e8f0] shadow-2xl shadow-[#4f46e5]/10 p-8">
          {/* Brand */}
          <div className="text-center mb-6">
            <img src={BRAND_ASSETS.logo} alt="PilotHobb" className="h-10 w-auto mx-auto mb-3" />
            <p className="text-[12px] tracking-[0.25em] text-[#464555] font-semibold uppercase">Aviation Intelligence</p>
          </div>

          {verified ? (
            <div className="rounded-2xl bg-[#10b981] text-white p-5 flex items-center gap-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8 shrink-0" />
              <div>
                <p className="font-bold text-lg leading-tight">Identity Verified</p>
                <p className="text-white/85 text-sm">Clear for takeoff. Redirecting…</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-[#464555] text-sm mb-6">Access your flight operations.</p>
              {error && <div className="mb-4 p-3 rounded-xl bg-[#ef4444]/10 text-[#b91c1c] text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#191c1e] mb-1.5">Aviator Email</label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9aa0ae]" />
                    <input type="email" autoComplete="email" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilot@airline.com"
                      className="w-full h-13 pl-11 pr-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-white text-[#191c1e] placeholder-[#9aa0ae] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 focus:border-[#4f46e5]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-[#191c1e]">Logbook Key</label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-[#4f46e5] hover:underline">Forgot Key?</Link>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9aa0ae]" />
                    <input type={showPw ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-13 pl-11 pr-11 py-3.5 rounded-xl border border-[#e2e8f0] bg-white text-[#191c1e] placeholder-[#9aa0ae] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 focus:border-[#4f46e5]" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa0ae] hover:text-[#464555]">
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                  <button type="button" onClick={() => setRemember(!remember)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${remember ? "bg-[#4f46e5] border-[#4f46e5]" : "bg-white border-[#c7c4d8]"}`}>
                    {remember && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                  <span className="text-sm text-[#464555]">Remember this terminal</span>
                </label>

                <button type="submit" disabled={loading}
                  className="w-full h-13 py-4 rounded-xl bg-[#4f46e5] text-white font-bold shadow-lg shadow-[#4f46e5]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Initiating…</> : <>Initiate Session <Rocket className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="text-center text-sm text-[#464555] mt-6">
                New operator?{" "}
                <Link to="/register" className="font-bold text-[#4f46e5] hover:underline">Apply for credentials</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
