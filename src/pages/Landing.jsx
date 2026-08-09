import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu, X, ArrowRight, PlayCircle, ShieldCheck, Gauge, FileDown,
  Wrench, PlaneTakeoff, CheckCircle2, Sparkles, ArrowLeftRight, Camera,
} from "lucide-react";
import Seo from "@/components/Seo";

const LOGO = "https://media.base44.com/images/public/6a455fc5475b58bb52305622/a0460c0c0_pilothobb-mark.svg";
const HERO_IMG = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80&auto=format&fit=crop";
const DRONE_IMG = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&q=75&auto=format&fit=crop";

const AUTHORITIES = ["SACAA", "FAA", "EASA", "UK CAA", "CASA"];

const TIERS = [
  {
    name: "Student", price: "Free trial", period: "14 days · no card",
    features: ["Unlimited flight logging", "Hobbs / Tach auto-totals", "Currency & exam clocks"],
    cta: "Start free", to: "/register", highlighted: false,
  },
  {
    name: "Pilot Pro", price: "$6.99", period: "/month · or $69/year — save 18%",
    features: ["Everything in Student", "Licence & medical renewals", "Page-replica PDF export", "Endorsements with photos", "Camera meter scan (soon)"],
    cta: "Get Pilot Pro", to: "/register", highlighted: true,
  },
  {
    name: "Academy", price: "Talk to us", period: "per-seat · billed yearly",
    features: ["Everything in Pilot Pro", "Student roster & oversight", "Bulk seats & school branding"],
    cta: "Contact sales", to: "/contact", highlighted: false,
  },
];

const landingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://pilothobb.com/#org",
      "name": "PilotHobb",
      "url": "https://pilothobb.com",
      "email": "hello@pilothobb.com",
      "logo": "https://media.base44.com/images/public/6a455fc5475b58bb52305622/1a9086f0b_pilothobb-icon-appstore-1024.png"
    },
    {
      "@type": "SoftwareApplication",
      "name": "PilotHobb",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "url": "https://pilothobb.com",
      "publisher": { "@id": "https://pilothobb.com/#org" },
      "description": "Digital pilot logbook for tracking flight hours from Hobbs or Tach readings, licence and medical currency, aircraft maintenance, and RPAS drone hours.",
      "featureList": [
        "Log flights from Hobbs or Tach meter readings",
        "Scan the Hobbs meter with your camera",
        "Automatic touch-and-go landing and take-off totals",
        "Licence, medical and rating expiry tracking",
        "Aircraft maintenance monitoring (MPI and oil hours)",
        "RPAS drone hours tracked separately from manned hours",
        "Career summary and logbook PDF export"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Does PilotHobb track drone (RPAS) hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. PilotHobb tracks RPAS drone hours in a separate total from manned aeroplane and helicopter hours, because aviation authorities require remote pilot time to be logged separately. Drone flights record mission type, VLOS/BVLOS operation category, battery cycles and observer, and roll into their own RPAS totals." } },
        { "@type": "Question", "name": "Can I log flights using Hobbs or Tach time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Each aircraft is set to either Hobbs or Tach as its time source. When logging a flight, PilotHobb pre-fills the reading before from the aircraft's last known meter value, you enter the reading after, and flight time is calculated automatically. You can also scan the meter with your phone camera instead of typing it." } },
        { "@type": "Question", "name": "Does PilotHobb track licence and medical expiry?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. PilotHobb tracks licences, ratings, medicals, theory exam validity and English proficiency, showing days remaining with colour-coded status and surfacing the nearest expiry so nothing lapses." } },
        { "@type": "Question", "name": "Which aviation authorities does PilotHobb support?", "acceptedAnswer": { "@type": "Answer", "text": "PilotHobb supports pilots under SACAA, FAA, EASA, UK CAA and CASA, for both manned licences (Student, PPL, CPL, ATPL) and remote pilot licences such as SACAA RPL and FAA Part 107." } },
        { "@type": "Question", "name": "How is a touch-and-go counted in PilotHobb?", "acceptedAnswer": { "@type": "Answer", "text": "Each touch-and-go counts as one landing and one take-off. PilotHobb totals them automatically from the intermediate stops you add to a route, plus the initial take-off and the final full-stop landing." } }
      ]
    }
  ]
};

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed top-0 w-full z-50 backdrop-blur-md transition-all ${scrolled ? "bg-[#f7f9fb]/90 shadow-sm" : "bg-[#f7f9fb]/70"}`}>
      <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={LOGO} alt="PilotHobb" className="h-9 w-9" />
          <span className="text-[22px] font-heading font-bold tracking-tight"><span className="text-[#4f46e5]">Pilot</span><span className="text-[#0f172a]">Hobb</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-[15px] text-[#464555] font-medium hover:text-[#3525cd] transition-colors" href="#features">Features</a>
          <a className="text-[15px] text-[#464555] font-medium hover:text-[#3525cd] transition-colors" href="#pricing">Pricing</a>
          <Link className="text-[15px] text-[#464555] font-medium hover:text-[#3525cd] transition-colors" to="/about">About</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden md:block text-[15px] px-4 py-2 text-[#4f46e5] font-semibold hover:bg-[#f2f4f6] rounded-lg transition-colors">Login</Link>
          <Link to="/register" className="bg-[#4f46e5] text-white px-6 py-2 rounded-lg text-[15px] font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all">Get Started</Link>
          <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 flex items-center justify-center text-[#191c1e]">{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-[#e2e8f0] bg-[#f7f9fb]/95 backdrop-blur px-4 py-3">
          <a onClick={() => setOpen(false)} className="block py-3 font-medium text-[#464555]" href="#features">Features</a>
          <a onClick={() => setOpen(false)} className="block py-3 font-medium text-[#464555]" href="#pricing">Pricing</a>
          <Link onClick={() => setOpen(false)} className="block py-3 font-medium text-[#464555]" to="/about">About</Link>
          <Link onClick={() => setOpen(false)} className="block py-3 font-semibold text-[#4f46e5]" to="/login">Login</Link>
        </div>
      )}
    </header>
  );
}

function CardIcon({ children, tone = "indigo" }) {
  const bg = tone === "indigo" ? "bg-[#4f46e5]/10 text-[#4f46e5]" : "bg-white/15 text-white";
  return <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${bg}`}>{children}</div>;
}

export default function Landing() {
  return (
    <div id="top" className="bg-[#f7f9fb] text-[#191c1e] font-body min-h-screen">
      <Seo
        path="/"
        title="PilotHobb — Digital Pilot Logbook for Flight Hours, Currency & Drone Hours"
        description="PilotHobb is a digital pilot logbook that tracks flight hours from your Hobbs or Tach meter, licence and medical expiry, aircraft maintenance, and RPAS drone hours separately. For SACAA, FAA, EASA and UK CAA pilots."
        jsonLd={landingJsonLd}
      />
      <NavBar />

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundColor: "#e2e8f0" }}>
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${HERO_IMG}')` }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,#f7f9fb 0%, rgba(247,249,251,0.6) 45%, rgba(247,249,251,0) 100%)" }} />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[#4f46e5] text-[12px] font-semibold tracking-widest uppercase mb-4">
              <PlaneTakeoff className="w-4 h-4" /> Manned + RPAS · Compliance-ready
            </span>
            <h1 className="font-heading text-[40px] md:text-[56px] leading-[1.05] mb-6 text-[#191c1e]">
              The Logbook of the <span className="text-[#3525cd] italic">Modern Aviator.</span>
            </h1>
            <p className="text-[18px] md:text-[20px] text-[#464555] leading-relaxed mb-8 max-w-lg">
              Log every flight from your Hobbs or Tach, track licence and medical currency to the day, and keep RPAS drone hours separate — the digital pilot logbook for pilots worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-[#4f46e5] text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                Start free <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" className="bg-white border border-[#e2e8f0] text-[#4f46e5] px-8 py-4 rounded-xl font-bold hover:bg-[#f2f4f6] transition-all flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" /> See how it works
              </a>
            </div>
            <div className="mt-10">
              <p className="text-[12px] uppercase tracking-widest text-[#464555]/70 font-semibold mb-3">Built for pilots under</p>
              <div className="flex flex-wrap gap-2">
                {AUTHORITIES.map((a) => (
                  <span key={a} className="px-3 py-1.5 rounded-full bg-white border border-[#e2e8f0] text-[13px] font-semibold text-[#0f172a] font-mono">{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-heading text-[30px] md:text-[40px] font-bold mb-4">Built for the cockpit, designed for the cloud.</h2>
            <p className="text-[18px] text-[#464555]">Everything a working pilot needs to keep a clean, authority-ready logbook — for manned aircraft and drones alike.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Currency (wide + ring) */}
            <div className="md:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row gap-10 items-center shadow-sm hover:shadow-lg transition-all">
              <div className="flex-1 space-y-5">
                <CardIcon><ShieldCheck className="w-7 h-7" /></CardIcon>
                <h3 className="font-heading text-[26px] font-semibold">Currency, tracked to the day</h3>
                <p className="text-[#464555] leading-relaxed">Licences, medicals, ratings, theory-exam validity and English proficiency — days remaining, colour-coded, with the nearest expiry surfaced first so nothing ever lapses.</p>
              </div>
              <div className="flex-shrink-0 relative w-48 h-48 lg:w-56 lg:h-56 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 224 224">
                  <circle cx="112" cy="112" fill="transparent" r="90" stroke="#e2e8f0" strokeWidth="10" />
                  <circle cx="112" cy="112" fill="transparent" r="90" stroke="#4f46e5" strokeWidth="10" strokeLinecap="round" strokeDasharray="565" strokeDashoffset="140" />
                  <circle cx="112" cy="112" fill="transparent" r="72" stroke="#e2e8f0" strokeWidth="10" />
                  <circle cx="112" cy="112" fill="transparent" r="72" stroke="#14b8a6" strokeWidth="10" strokeLinecap="round" strokeDasharray="452" strokeDashoffset="90" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-bold text-[#3525cd]">94%</span>
                  <span className="text-[11px] font-semibold text-[#464555] tracking-wider">CURRENT</span>
                </div>
              </div>
            </div>

            {/* Hobbs/Tach (indigo card) */}
            <div className="md:col-span-4 bg-[#4f46e5] text-white rounded-2xl p-8 lg:p-10 flex flex-col justify-between shadow-xl hover:-translate-y-1 transition-all">
              <div>
                <CardIcon tone="light"><Gauge className="w-7 h-7" /></CardIcon>
                <h3 className="font-heading text-[26px] font-semibold mb-4">Hobbs &amp; Tach, done for you</h3>
                <p className="text-white/80">Set each aircraft to Hobbs or Tach. We pre-fill the reading before — you enter after, and flight time totals automatically.</p>
              </div>
              <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] tracking-wider opacity-60 font-semibold">FLIGHT TIME</span>
                  <span className="bg-[#14b8a6] text-white text-[10px] px-2 py-1 rounded font-bold">AUTO</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[13px] mb-2">
                  <span className="opacity-70">3421.5</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  <span className="opacity-70">3423.2</span>
                  <span className="font-bold">= 1.7h</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#14b8a6] w-[85%]" /></div>
                <div className="flex items-center gap-1.5 mt-3 text-[11px] opacity-80"><Camera className="w-3.5 h-3.5" /> Or scan the meter with your camera</div>
              </div>
            </div>

            {/* PDF export (dark navy) */}
            <div className="md:col-span-8 bg-[#0f172a] text-white rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row gap-10 items-center shadow-2xl relative overflow-hidden hover:-translate-y-1 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: "rgba(79,70,229,0.25)", filter: "blur(90px)" }} />
              <div className="flex-1 space-y-6 relative z-10">
                <CardIcon tone="light"><FileDown className="w-7 h-7" /></CardIcon>
                <h3 className="font-heading text-[26px] font-semibold">One-tap PDF export</h3>
                <p className="text-white/70 leading-relaxed">Export a clean, authority-ready logbook PDF — any page range, anytime. Your logbook is yours: cancel whenever, your data is never locked in.</p>
                <Link to="/register" className="inline-block bg-white text-[#0f172a] px-8 py-3.5 rounded-xl font-bold hover:bg-[#e2e8f0] transition-all">Try it free</Link>
              </div>
              <div className="p-6 rounded-2xl border border-white/20 w-full md:w-56 rotate-2 relative z-10" style={{ background: "rgba(255,255,255,0.85)" }}>
                <div className="space-y-3">
                  <div className="h-3 w-3/4 bg-[#191c1e]/10 rounded-full" />
                  <div className="h-3 w-1/2 bg-[#191c1e]/10 rounded-full" />
                  <div className="grid grid-cols-4 gap-2 pt-4">
                    <div className="h-9 bg-[#4f46e5]/20 rounded-lg" /><div className="h-9 bg-[#4f46e5]/20 rounded-lg" /><div className="h-9 bg-[#4f46e5]/20 rounded-lg" /><div className="h-9 bg-[#4f46e5]/20 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance (stat) */}
            <div className="md:col-span-4 bg-white border border-[#e2e8f0] rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-lg transition-all">
              <CardIcon><Wrench className="w-7 h-7" /></CardIcon>
              <h3 className="font-heading text-[26px] font-semibold mb-3">Aircraft maintenance</h3>
              <p className="text-[#464555] mb-6">MPI and oil hours tracked per airframe, with predictive due-alerts before you fly.</p>
              <div className="flex items-center gap-5">
                <div className="text-center"><div className="font-mono text-2xl font-bold text-[#4f46e5]">3</div><div className="text-[11px] text-[#464555] tracking-wider">AIRCRAFT</div></div>
                <div className="w-px h-8 bg-[#e2e8f0]" />
                <div className="text-center"><div className="font-mono text-2xl font-bold text-[#f59e0b]">28h</div><div className="text-[11px] text-[#464555] tracking-wider">MPI DUE</div></div>
              </div>
            </div>

            {/* Manned + RPAS (wide with image) */}
            <div className="md:col-span-12 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row group">
              <div className="md:w-1/2 h-56 md:h-auto overflow-hidden relative" style={{ backgroundColor: "#e2e8f0" }}>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${DRONE_IMG}')`, minHeight: "260px" }} />
                <div className="absolute inset-0" style={{ background: "rgba(53,37,205,0.08)" }} />
              </div>
              <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center gap-2 text-[#14b8a6] text-[11px] tracking-widest uppercase font-semibold"><ArrowLeftRight className="w-4 h-4" /> Manned + RPAS</div>
                <h3 className="font-heading text-[26px] font-semibold">Drone hours, kept separate</h3>
                <p className="text-[#464555] leading-relaxed max-w-md">RPAS time logs into its own totals — mission type, VLOS/BVLOS operation category, battery cycles and observer — exactly how the authorities require. Never mix remote-pilot and manned hours again.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-[#f7f9fb]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading text-[30px] md:text-[40px] font-bold">One subscription. Your whole flying career.</h2>
            <p className="text-[18px] text-[#464555]">Start free, keep your logbook for life. Cancel anytime — your data exports to PDF whenever you want it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {TIERS.map((t) => (
              <div key={t.name} className={`rounded-2xl p-8 lg:p-10 flex flex-col relative ${t.highlighted ? "bg-white border-2 border-[#4f46e5]/40 shadow-xl md:-mt-2" : "bg-white border border-[#e2e8f0] shadow-sm"}`}>
                {t.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4f46e5] text-white px-5 py-1.5 rounded-full text-[11px] tracking-widest font-bold shadow-lg uppercase">Most Popular</div>
                )}
                <h3 className="font-heading text-[24px] font-semibold mb-2">{t.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-mono text-4xl font-bold text-[#3525cd]">{t.price}</span>
                </div>
                <p className="text-[13px] text-[#464555] mb-8">{t.period}</p>
                <ul className="space-y-4 mb-10 flex-1">
                  {t.features.map((f, i) => (
                    <li key={f} className={`flex items-center gap-3 text-[15px] ${i === 0 && t.highlighted ? "text-[#3525cd] font-bold" : "text-[#464555]"}`}>
                      {i === 0 && t.highlighted ? <Sparkles className="w-5 h-5 text-[#4f46e5] shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />}
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={t.to} className={`w-full text-center py-4 rounded-xl font-bold transition-all ${t.highlighted ? "bg-[#4f46e5] text-white shadow-lg hover:brightness-110" : "border-2 border-[#4f46e5]/20 text-[#4f46e5] hover:bg-[#4f46e5]/5"}`}>{t.cta}</Link>
              </div>
            ))}
          </div>
          <p className="text-center text-[13px] text-[#464555]/70 mt-8">Prices shown are placeholders — final pricing set at launch. Shown in USD.</p>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-24 bg-[#3525cd] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <h2 className="font-heading text-[32px] md:text-[42px] font-bold leading-tight">Start your logbook tonight.</h2>
          <p className="text-[20px] text-white/80 max-w-2xl mx-auto">Log your first flight in under a minute. No card required — keep your logbook for life.</p>
          <div className="pt-2">
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-[#3525cd] px-12 py-5 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold tracking-wide uppercase text-sm">
              Start free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f2f4f6] pt-20 pb-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-6">
                <img src={LOGO} alt="PilotHobb" className="h-9 w-9" />
                <span className="text-[22px] font-heading font-bold tracking-tight"><span className="text-[#4f46e5]">Pilot</span><span className="text-[#0f172a]">Hobb</span></span>
              </div>
              <p className="text-[14px] text-[#464555]">Your logbook, down to the tenth of an hour. Professional tools for the modern cockpit and remote control station.</p>
            </div>
            <div>
              <h4 className="text-[12px] text-[#191c1e] font-bold mb-6 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4 text-[14px] text-[#464555]">
                <li><a className="hover:text-[#4f46e5] transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-[#4f46e5] transition-colors" href="#pricing">Pricing</a></li>
                <li><Link className="hover:text-[#4f46e5] transition-colors" to="/register">Get started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[12px] text-[#191c1e] font-bold mb-6 uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-[14px] text-[#464555]">
                <li><Link className="hover:text-[#4f46e5] transition-colors" to="/about">About</Link></li>
                <li><Link className="hover:text-[#4f46e5] transition-colors" to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[12px] text-[#191c1e] font-bold mb-6 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-[14px] text-[#464555]">
                <li><Link className="hover:text-[#4f46e5] transition-colors" to="/contact">Privacy Policy</Link></li>
                <li><Link className="hover:text-[#4f46e5] transition-colors" to="/contact">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#e2e8f0] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] text-[#464555]/60">© 2026 PilotHobb. All rights reserved.</p>
            <p className="text-[13px] text-[#464555]/60">For SACAA · FAA · EASA · UK CAA · CASA pilots</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
