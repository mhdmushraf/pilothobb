import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu, X, ArrowRight, PlayCircle, ShieldCheck, Gauge, FileDown,
  Wrench, PlaneTakeoff, CheckCircle2, Sparkles, ArrowLeftRight, Camera,
  Plane, ChevronDown, Minus } from
"lucide-react";
import Seo from "@/components/Seo";
import StoreButtons from "@/components/StoreButtons";
import Logo from "@/components/Logo";

// PilotHobb explainer video (hosted on Base44 media).
const DEMO_VIDEO = "https://media.base44.com/videos/public/6a455fc5475b58bb52305622/84d4c3188_pilothobb_demo_v6.mp4";
const HERO_IMG = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80&auto=format&fit=crop";
const DRONE_IMG = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&q=75&auto=format&fit=crop";

const AUTHORITIES = ["SACAA", "FAA", "EASA", "UK CAA", "CASA"];

const TIERS = [
{
  name: "Free", price: "R0", period: "for student pilots · free forever",
  features: ["Up to 50 flight entries", "Up to 3 aircraft", "CPL hour dashboard (view only)", "CSV export — always"],
  cta: "Start free", to: "/register", highlighted: false
},
{
  name: "CPL", price: "R499", period: "/year · or R59/month (~$27/yr)",
  features: ["Unlimited flights & aircraft", "SACAA-shaped export", "CA 61-91 auto pre-fill", "Credit expiry alerts", "Clean PDF logbook print"],
  cta: "Get CPL", to: "/register", highlighted: true
},
{
  name: "School", price: "R199", period: "per student / year · min 10 seats",
  features: ["Everything in CPL", "Student roster & oversight", "Bulk seats, billed yearly", "School branding"],
  cta: "Contact sales", to: "/contact", highlighted: false
}];

const FAQS = [
{ q: "Does PilotHobb track drone (RPAS) hours?", a: "Yes — RPAS time logs into its own totals, separate from manned hours, with mission type, VLOS/BVLOS category, battery cycles and observer, exactly how authorities require." },
{ q: "Can I log flights using Hobbs or Tach time?", a: "Yes. Set each aircraft to Hobbs or Tach; we pre-fill the reading before, you enter after, and flight time calculates automatically. You can even scan the meter with your phone camera." },
{ q: "Does it track licence and medical expiry?", a: "Yes — licences, ratings, medicals, exam validity and English proficiency, with days-remaining and colour-coded status so nothing lapses." },
{ q: "Which authorities are supported?", a: "SACAA, FAA, EASA, UK CAA and CASA — for manned licences (Student, PPL, CPL, ATPL) and remote pilot licences like SACAA RPL and FAA Part 107." },
{ q: "Is my data locked in?", a: "Never. Export a clean PDF or a full CSV of your entire logbook anytime, on any plan. Cancel whenever — your records are always yours." }];


const landingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
  {
    "@type": "Organization",
    "@id": "https://pilothobb.com/#org",
    "name": "PilotHobb",
    "url": "https://pilothobb.com",
    "email": "hello@linkzoneglobal.com",
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
    "Career summary and logbook PDF export"]

  },
  {
    "@type": "FAQPage",
    "mainEntity": [
    { "@type": "Question", "name": "Does PilotHobb track drone (RPAS) hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. PilotHobb tracks RPAS drone hours in a separate total from manned aeroplane and helicopter hours, because aviation authorities require remote pilot time to be logged separately. Drone flights record mission type, VLOS/BVLOS operation category, battery cycles and observer, and roll into their own RPAS totals." } },
    { "@type": "Question", "name": "Can I log flights using Hobbs or Tach time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Each aircraft is set to either Hobbs or Tach as its time source. When logging a flight, PilotHobb pre-fills the reading before from the aircraft's last known meter value, you enter the reading after, and flight time is calculated automatically. You can also scan the meter with your phone camera instead of typing it." } },
    { "@type": "Question", "name": "Does PilotHobb track licence and medical expiry?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. PilotHobb tracks licences, ratings, medicals, theory exam validity and English proficiency, showing days remaining with colour-coded status and surfacing the nearest expiry so nothing lapses." } },
    { "@type": "Question", "name": "Which aviation authorities does PilotHobb support?", "acceptedAnswer": { "@type": "Answer", "text": "PilotHobb supports pilots under SACAA, FAA, EASA, UK CAA and CASA, for both manned licences (Student, PPL, CPL, ATPL) and remote pilot licences such as SACAA RPL and FAA Part 107." } },
    { "@type": "Question", "name": "How is a touch-and-go counted in PilotHobb?", "acceptedAnswer": { "@type": "Answer", "text": "Each touch-and-go counts as one landing and one take-off. PilotHobb totals them automatically from the intermediate stops you add to a route, plus the initial take-off and the final full-stop landing." } }]

  }]

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
    <header className={`fixed top-0 w-full z-50 backdrop-blur-md transition-all ${scrolled ? "bg-cockpit-bg/90 shadow-lg shadow-black/30" : "bg-cockpit-bg/70"}`}>
      <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        <a href="#top" className="flex items-center">
          <Logo size={32} />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-[15px] text-cockpit-muted font-medium hover:text-cockpit-amber transition-colors" href="#features">Features</a>
          <a className="text-[15px] text-cockpit-muted font-medium hover:text-cockpit-amber transition-colors" href="#pricing">Pricing</a>
          <Link className="text-[15px] text-cockpit-muted font-medium hover:text-cockpit-amber transition-colors" to="/about">About</Link>
          <Link className="text-[15px] text-cockpit-muted font-medium hover:text-cockpit-amber transition-colors" to="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden md:block text-[15px] px-4 py-2 text-cockpit-amber font-semibold hover:bg-cockpit-panel-light rounded-lg transition-colors">Login</Link>
          <Link to="/register" className="bg-cockpit-amber text-cockpit-bg px-6 py-2 rounded-lg text-[15px] font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all">Get Started</Link>
          <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 flex items-center justify-center text-cockpit-cream">{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        </div>
      </div>
      {open &&
      <div className="md:hidden border-t border-cockpit-border bg-cockpit-bg/95 backdrop-blur px-4 py-3">
          <a onClick={() => setOpen(false)} className="block py-3 font-medium text-cockpit-muted" href="#features">Features</a>
          <a onClick={() => setOpen(false)} className="block py-3 font-medium text-cockpit-muted" href="#pricing">Pricing</a>
          <Link onClick={() => setOpen(false)} className="block py-3 font-medium text-cockpit-muted" to="/about">About</Link>
          <Link onClick={() => setOpen(false)} className="block py-3 font-medium text-cockpit-muted" to="/contact">Contact</Link>
          <Link onClick={() => setOpen(false)} className="block py-3 font-semibold text-cockpit-amber" to="/login">Login</Link>
        </div>
      }
    </header>);

}

function CardIcon({ children, tone = "indigo" }) {
  const bg =
  tone === "onAccent" ? "bg-cockpit-bg/15 text-cockpit-bg" :
  tone === "light" ? "bg-cockpit-amber/15 text-cockpit-amber" :
  "bg-cockpit-amber/10 text-cockpit-amber";
  return <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${bg}`}>{children}</div>;
}

function CountUp({ end, decimals = 0, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = React.useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration);
            setVal(end * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val.toFixed(decimals)}</span>;
}

function Stat({ value, label, sub }) {
  return (
    <div>
      <div className="font-mono text-[34px] md:text-[42px] font-bold text-cockpit-amber leading-none">{value}</div>
      <div className="text-[14px] font-semibold text-cockpit-cream mt-2">{label}</div>
      <div className="text-[12px] text-cockpit-muted mt-1">{sub}</div>
    </div>
  );
}

function Step({ n, icon: Icon, title, children }) {
  return (
    <div className="bg-cockpit-panel border border-cockpit-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-9 h-9 rounded-full bg-cockpit-amber text-cockpit-bg font-mono font-bold flex items-center justify-center">{n}</span>
        <Icon className="w-6 h-6 text-cockpit-amber" />
      </div>
      <h3 className="font-heading text-[22px] font-semibold mb-2">{title}</h3>
      <p className="text-cockpit-muted leading-relaxed">{children}</p>
    </div>
  );
}

function Reveal({ children, className = "" }) {
  const ref = React.useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`${className} transition-all duration-700 ease-out ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>{children}</div>;
}

const COMPARE = [
["Manned + RPAS in one logbook", true, false],
["Official SACAA 32-column export", true, false],
["Scan the Hobbs with your camera", true, false],
["Currency to the day, with alerts", true, "partial"],
["Fuel, expenses & maintenance built in", true, false],
["Free-forever tier", true, "partial"],
["PDF + CSV export, no lock-in", true, true]];

function Mark({ v }) {
  if (v === true) return <CheckCircle2 className="w-5 h-5 text-cockpit-valid" />;
  if (v === "partial") return <Minus className="w-5 h-5 text-cockpit-warning" />;
  return <X className="w-5 h-5 text-cockpit-muted/50" />;
}

export default function Landing() {
  const [showVideo, setShowVideo] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [rb, setRb] = useState(3421.5);
  const [ra, setRa] = useState(3423.2);
  const tryFt = Math.max(0, Math.round(((Number(ra) || 0) - (Number(rb) || 0)) * 10) / 10);
  return (
    <div id="top" className="bg-cockpit-bg text-cockpit-cream font-body min-h-screen">
      <Seo
        path="/"
        title="PilotHobb — Digital Pilot Logbook for Flight Hours, Currency & Drone Hours"
        description="PilotHobb is a digital pilot logbook that tracks flight hours from your Hobbs or Tach meter, licence and medical expiry, aircraft maintenance, and RPAS drone hours separately. For SACAA, FAA, EASA and UK CAA pilots."
        jsonLd={landingJsonLd} />
      
      <NavBar />

      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cockpit-bg/85 backdrop-blur-sm p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowVideo(false)} aria-label="Close" className="absolute -top-11 right-0 text-cockpit-cream/80 hover:text-cockpit-cream flex items-center gap-1 text-sm font-semibold">
              <X className="w-5 h-5" /> Close
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
              <video src={DEMO_VIDEO} controls autoPlay playsInline className="w-full h-full" />
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundColor: "#0A0E17" }}>
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${HERO_IMG}')` }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,#0A0E17 0%, rgba(10,14,23,0.75) 45%, rgba(10,14,23,0) 100%)" }} />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-cockpit-amber text-[12px] font-semibold tracking-widest uppercase mb-4">
              <PlaneTakeoff className="w-4 h-4" /> Manned + RPAS · Compliance-ready
            </span>
            <h1 className="font-heading text-[40px] md:text-[56px] leading-[1.05] mb-6 text-cockpit-cream">
              The Logbook of the <span className="text-cockpit-amber italic">Modern Aviator.</span>
            </h1>
            <p className="text-[18px] md:text-[20px] text-cockpit-muted leading-relaxed mb-8 max-w-lg">
              Log every flight from your Hobbs or Tach, track licence and medical currency to the day, and keep RPAS drone hours separate — the digital pilot logbook for pilots worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-cockpit-amber text-cockpit-bg px-8 py-4 rounded-xl font-bold shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                Start free <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={() => { if (DEMO_VIDEO) { setShowVideo(true); } else { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); } }}
                className="bg-cockpit-panel border border-cockpit-border text-cockpit-amber px-8 py-4 rounded-xl font-bold hover:bg-cockpit-panel-light transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" /> See how it works
              </button>
            </div>
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-widest text-cockpit-muted font-semibold mb-2">Get the app</p>
              <StoreButtons />
            </div>
            <div className="mt-8">
              <p className="text-[12px] uppercase tracking-widest text-cockpit-muted font-semibold mb-3">Built for pilots under</p>
              <div className="flex flex-wrap gap-2">
                {AUTHORITIES.map((a) =>
                <span key={a} className="px-3 py-1.5 rounded-full bg-cockpit-panel border border-cockpit-border text-[13px] font-semibold text-cockpit-cream font-mono">{a}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="py-14 bg-cockpit-panel border-b border-cockpit-border">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat value={<CountUp end={32} />} label="Column official logbook" sub="Full SACAA-format export" />
          <Stat value={<CountUp end={5} />} label="Authorities supported" sub="SACAA · FAA · EASA · UK CAA · CASA" />
          <Stat value="0.1h" label="Logged to the tenth" sub="Hobbs &amp; Tach precision" />
          <Stat value="PDF · CSV" label="Export anytime" sub="Your data, always yours" />
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="py-24 bg-cockpit-panel overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-cockpit-amber text-[12px] font-semibold tracking-widest uppercase mb-3"><Sparkles className="w-4 h-4" /> In your pocket</span>
            <h2 className="font-heading text-[30px] md:text-[40px] font-bold mb-5 leading-tight">Your whole cockpit, on the home screen.</h2>
            <p className="text-[18px] text-cockpit-muted leading-relaxed mb-8">Total time, currency and your last flights the moment you open the app — no digging, no spreadsheets. Log a flight in seconds; see everything at a glance.</p>
            <ul className="space-y-3 mb-8">
              {["Live total time, down to the tenth", "Night & instrument currency, colour-coded", "This-month snapshot and smart insights"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15px] text-cockpit-cream"><CheckCircle2 className="w-5 h-5 text-cockpit-valid shrink-0" /> {t}</li>
              ))}
            </ul>
            <Link to="/register" className="inline-flex items-center gap-2 bg-cockpit-amber text-cockpit-bg px-8 py-3.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">Start free <ArrowRight className="w-4 h-4" /></Link>
          </Reveal>
          <Reveal className="flex justify-center">
            <div className="ph-float relative" style={{ width: 280 }}>
              <div className="rounded-[2.6rem] bg-cockpit-border p-2.5" style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.65)" }}>
                <div className="rounded-[2.1rem] bg-cockpit-panel overflow-hidden relative" style={{ height: 566 }}>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-cockpit-border rounded-full z-10" />
                  <div className="px-4 pt-9 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-heading font-bold text-[15px] text-cockpit-cream">Pilot<span className="text-cockpit-amber">Hobb</span></span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-cockpit-bg text-[11px] font-bold" style={{ background: "linear-gradient(135deg,#FF9D2E,#6FE0A6)" }}>MM</div>
                    </div>
                    <p className="text-[11px] text-cockpit-muted">Good afternoon, Captain</p>
                    <p className="text-[15px] font-bold text-cockpit-cream leading-tight mb-3">M. Musharaf</p>
                    <div className="rounded-2xl border border-cockpit-border bg-cockpit-panel-light p-4 text-center mb-3 shadow-sm">
                      <p className="text-[9px] tracking-widest text-cockpit-muted uppercase mb-1">Total Time</p>
                      <p className="font-mono text-[34px] font-bold text-cockpit-cream leading-none">44.5<span className="text-[13px] text-cockpit-muted ml-1">HRS</span></p>
                      <p className="text-[9px] text-cockpit-muted mt-1 font-mono">52 LDG · 12 T/O</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-xl border border-cockpit-border bg-cockpit-panel-light p-2.5"><p className="text-[8px] uppercase tracking-widest text-cockpit-muted">PIC</p><p className="font-mono text-lg font-bold text-cockpit-amber leading-none mt-0.5">12.4</p></div>
                      <div className="rounded-xl border border-cockpit-border bg-cockpit-panel-light p-2.5"><p className="text-[8px] uppercase tracking-widest text-cockpit-muted">Dual</p><p className="font-mono text-lg font-bold text-cockpit-cream leading-none mt-0.5">24.2</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-xl border border-cockpit-border bg-cockpit-panel-light p-2.5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cockpit-valid" /><div><p className="text-[8px] uppercase tracking-widest text-cockpit-muted">Night</p><p className="font-mono text-[12px] font-bold text-cockpit-valid leading-none">72d</p></div></div>
                      <div className="rounded-xl border border-cockpit-border bg-cockpit-panel-light p-2.5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cockpit-warning" /><div><p className="text-[8px] uppercase tracking-widest text-cockpit-muted">Instrument</p><p className="font-mono text-[12px] font-bold text-cockpit-warning leading-none">18d</p></div></div>
                    </div>
                    <div className="rounded-xl border border-cockpit-border bg-cockpit-panel-light p-3">
                      <p className="text-[8px] uppercase tracking-widest text-cockpit-muted mb-2">Recent</p>
                      <div className="flex items-center justify-between">
                        <div><p className="font-mono text-[12px] font-semibold text-cockpit-cream">FAHG–FAHG</p><p className="text-[9px] text-cockpit-muted font-mono">17 Jul · ZS-MAE</p></div>
                        <span className="font-mono text-[13px] font-bold text-cockpit-amber">2.0h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <style>{`@keyframes phFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}.ph-float{animation:phFloat 6s ease-in-out infinite}`}</style>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-cockpit-panel">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-heading text-[30px] md:text-[40px] font-bold mb-4">Built for the cockpit, designed for the cloud.</h2>
            <p className="text-[18px] text-cockpit-muted">Everything a working pilot needs to keep a clean, authority-ready logbook — for manned aircraft and drones alike.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Currency (wide + ring) */}
            <div className="md:col-span-8 bg-cockpit-panel-light border border-cockpit-border rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row gap-10 items-center shadow-sm hover:shadow-lg transition-all">
              <div className="flex-1 space-y-5">
                <CardIcon><ShieldCheck className="w-7 h-7" /></CardIcon>
                <h3 className="font-heading text-[26px] font-semibold">Currency, tracked to the day</h3>
                <p className="text-cockpit-muted leading-relaxed">Licences, medicals, ratings, theory-exam validity and English proficiency — days remaining, colour-coded, with the nearest expiry surfaced first so nothing ever lapses.</p>
              </div>
              <div className="flex-shrink-0 relative w-48 h-48 lg:w-56 lg:h-56 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 224 224">
                  <circle cx="112" cy="112" fill="transparent" r="90" stroke="#243049" strokeWidth="10" />
                  <circle cx="112" cy="112" fill="transparent" r="90" stroke="#FF9D2E" strokeWidth="10" strokeLinecap="round" strokeDasharray="565" strokeDashoffset="140" />
                  <circle cx="112" cy="112" fill="transparent" r="72" stroke="#243049" strokeWidth="10" />
                  <circle cx="112" cy="112" fill="transparent" r="72" stroke="#6FE0A6" strokeWidth="10" strokeLinecap="round" strokeDasharray="452" strokeDashoffset="90" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-bold text-cockpit-amber">94%</span>
                  <span className="text-[11px] font-semibold text-cockpit-muted tracking-wider">CURRENT</span>
                </div>
              </div>
            </div>

            {/* Hobbs/Tach (amber card) */}
            <div className="md:col-span-4 bg-cockpit-amber text-cockpit-bg rounded-2xl p-8 lg:p-10 flex flex-col justify-between shadow-xl hover:-translate-y-1 transition-all">
              <div>
                <CardIcon tone="onAccent"><Gauge className="w-7 h-7" /></CardIcon>
                <h3 className="font-heading text-[26px] font-semibold mb-4">Hobbs &amp; Tach, done for you</h3>
                <p className="text-cockpit-bg/80">Set each aircraft to Hobbs or Tach. We pre-fill the reading before — you enter after, and flight time totals automatically.</p>
              </div>
              <div className="mt-8 bg-cockpit-bg/10 backdrop-blur-md rounded-xl p-4 border border-cockpit-bg/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] tracking-wider opacity-60 font-semibold">FLIGHT TIME</span>
                  <span className="bg-cockpit-bg text-cockpit-amber text-[10px] px-2 py-1 rounded font-bold">AUTO</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[13px] mb-2">
                  <span className="opacity-70">3421.5</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  <span className="opacity-70">3423.2</span>
                  <span className="font-bold">= 1.7h</span>
                </div>
                <div className="h-2 w-full bg-cockpit-bg/20 rounded-full overflow-hidden"><div className="h-full bg-cockpit-bg w-[85%]" /></div>
                <div className="flex items-center gap-1.5 mt-3 text-[11px] opacity-80"><Camera className="w-3.5 h-3.5" /> Or scan the meter with your camera</div>
              </div>
            </div>

            {/* PDF export (dark panel) */}
            <div className="md:col-span-8 bg-cockpit-panel-light text-cockpit-cream rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row gap-10 items-center shadow-2xl relative overflow-hidden hover:-translate-y-1 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: "rgba(255,157,46,0.22)", filter: "blur(90px)" }} />
              <div className="flex-1 space-y-6 relative z-10">
                <CardIcon tone="light"><FileDown className="w-7 h-7" /></CardIcon>
                <h3 className="font-heading text-[26px] font-semibold">One-tap PDF export</h3>
                <p className="text-cockpit-cream/70 leading-relaxed">Export a clean, authority-ready logbook PDF — any page range, anytime. Your logbook is yours: cancel whenever, your data is never locked in.</p>
                <Link to="/register" className="inline-block bg-cockpit-amber text-cockpit-bg px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all">Try it free</Link>
              </div>
              <div className="p-6 rounded-2xl border border-cockpit-border w-full md:w-56 rotate-2 relative z-10" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="space-y-3">
                  <div className="h-3 w-3/4 bg-cockpit-cream/15 rounded-full" />
                  <div className="h-3 w-1/2 bg-cockpit-cream/15 rounded-full" />
                  <div className="grid grid-cols-4 gap-2 pt-4">
                    <div className="h-9 bg-cockpit-amber/25 rounded-lg" /><div className="h-9 bg-cockpit-amber/25 rounded-lg" /><div className="h-9 bg-cockpit-amber/25 rounded-lg" /><div className="h-9 bg-cockpit-amber/25 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance (stat) */}
            <div className="md:col-span-4 bg-cockpit-panel-light border border-cockpit-border rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-lg transition-all">
              <CardIcon><Wrench className="w-7 h-7" /></CardIcon>
              <h3 className="font-heading text-[26px] font-semibold mb-3">Aircraft maintenance</h3>
              <p className="text-cockpit-muted mb-6">MPI and oil hours tracked per airframe, with predictive due-alerts before you fly.</p>
              <div className="flex items-center gap-5">
                <div className="text-center"><div className="font-mono text-2xl font-bold text-cockpit-amber">3</div><div className="text-[11px] text-cockpit-muted tracking-wider">AIRCRAFT</div></div>
                <div className="w-px h-8 bg-cockpit-border" />
                <div className="text-center"><div className="font-mono text-2xl font-bold text-cockpit-warning">28h</div><div className="text-[11px] text-cockpit-muted tracking-wider">MPI DUE</div></div>
              </div>
            </div>

            {/* Manned + RPAS (wide with image) */}
            <div className="md:col-span-12 bg-cockpit-panel-light border border-cockpit-border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row group">
              <div className="md:w-1/2 h-56 md:h-auto overflow-hidden relative" style={{ backgroundColor: "#0A0E17" }}>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${DRONE_IMG}')`, minHeight: "260px" }} />
                <div className="absolute inset-0" style={{ background: "rgba(255,157,46,0.08)" }} />
              </div>
              <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center gap-2 text-cockpit-valid text-[11px] tracking-widest uppercase font-semibold"><ArrowLeftRight className="w-4 h-4" /> Manned + RPAS</div>
                <h3 className="font-heading text-[26px] font-semibold">Drone hours, kept separate</h3>
                <p className="text-cockpit-muted leading-relaxed max-w-md">RPAS time logs into its own totals — mission type, VLOS/BVLOS operation category, battery cycles and observer — exactly how the authorities require. Never mix remote-pilot and manned hours again.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRY IT LIVE */}
      <section className="py-24 bg-cockpit-panel-light text-cockpit-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: "rgba(255,157,46,0.25)", filter: "blur(120px)" }} />
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 text-cockpit-amber text-[12px] font-semibold tracking-widest uppercase mb-3"><Gauge className="w-4 h-4" /> Try it live</span>
              <h2 className="font-heading text-[30px] md:text-[40px] font-bold mb-4">No more mental math on the ramp.</h2>
              <p className="text-[18px] text-cockpit-cream/70">Enter your Hobbs readings — watch flight time calculate the instant you type. That's exactly how every flight logs.</p>
            </div>
            <div className="bg-white/[0.04] backdrop-blur-md border border-cockpit-border rounded-3xl p-8 md:p-10">
              <div className="grid md:grid-cols-3 gap-6 items-end">
                <label className="block"><span className="text-[11px] uppercase tracking-widest text-cockpit-muted font-semibold">Reading before</span>
                  <input type="number" step="0.1" value={rb} onChange={(e) => setRb(e.target.value)} className="w-full mt-2 bg-cockpit-bg/60 border border-cockpit-border rounded-xl px-4 py-3 text-cockpit-cream font-mono text-lg focus:border-cockpit-amber outline-none" /></label>
                <label className="block"><span className="text-[11px] uppercase tracking-widest text-cockpit-muted font-semibold">Reading after</span>
                  <input type="number" step="0.1" value={ra} onChange={(e) => setRa(e.target.value)} className="w-full mt-2 bg-cockpit-bg/60 border border-cockpit-border rounded-xl px-4 py-3 text-cockpit-cream font-mono text-lg focus:border-cockpit-amber outline-none" /></label>
                <div className="text-center md:text-left">
                  <p className="text-[11px] uppercase tracking-widest text-cockpit-muted font-semibold">Flight time</p>
                  <p className="font-mono text-5xl font-bold text-cockpit-valid leading-none mt-2">{tryFt.toFixed(1)}<span className="text-2xl">h</span></p>
                </div>
              </div>
              <div className="mt-7 h-2 bg-cockpit-bg/60 rounded-full overflow-hidden"><div className="h-full bg-cockpit-valid transition-all duration-300" style={{ width: `${Math.min(100, (tryFt / 3) * 100)}%` }} /></div>
              <p className="text-cockpit-muted text-[13px] mt-4 flex items-center gap-2"><Camera className="w-4 h-4" /> In the app, scan the meter with your camera instead of typing.</p>
              <div className="mt-7"><Link to="/register" className="inline-flex items-center gap-2 bg-cockpit-amber text-cockpit-bg px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all">Log flights this fast — free <ArrowRight className="w-4 h-4" /></Link></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-cockpit-bg">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-heading text-[30px] md:text-[40px] font-bold mb-4">Your logbook, in three taps.</h2>
            <p className="text-[18px] text-cockpit-muted">From meter reading to authority-ready record — without the paper.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Step n="1" icon={Plane} title="Add your aircraft">Set each aircraft to Hobbs or Tach once. We remember the last reading so every flight starts from the right number.</Step>
            <Step n="2" icon={Gauge} title="Log from the meter">Scan the Hobbs with your camera or type it in. Flight time, landings and take-offs total automatically.</Step>
            <Step n="3" icon={ShieldCheck} title="Stay current &amp; export">Currency alerts keep medicals and ratings from lapsing — then export a clean PDF or the official 32-column logbook in one tap.</Step>
          </div>
        </div>
      </section>

      {/* PAPER vs PILOTHOBB */}
      <section className="py-24 bg-cockpit-panel">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <h2 className="font-heading text-[30px] md:text-[40px] font-bold mb-4">Retire the paper logbook.</h2>
            <p className="text-[18px] text-cockpit-muted">Everything the green book does — without the smudges, the maths, or the risk of losing it.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-cockpit-border bg-cockpit-bg p-8">
              <p className="text-[13px] uppercase tracking-widest font-bold text-cockpit-muted/60 mb-5">Paper logbook</p>
              <ul className="space-y-3.5">
                {["Add up columns by hand", "Guess when your medical expires", "Re-total every page for a checkride", "One coffee spill from disaster", "Drone hours mixed in or on scraps"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-cockpit-muted"><X className="w-5 h-5 text-cockpit-muted/50 shrink-0 mt-0.5" /> {t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-cockpit-amber/30 bg-cockpit-amber/[0.04] p-8 shadow-lg">
              <p className="text-[13px] uppercase tracking-widest font-bold text-cockpit-amber mb-5">PilotHobb</p>
              <ul className="space-y-3.5">
                {["Totals calculated to the tenth, instantly", "Currency to the day, colour-coded", "Authority-ready PDF in one tap", "Backed up in the cloud, exportable anytime", "RPAS hours kept cleanly separate"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-cockpit-cream font-medium"><CheckCircle2 className="w-5 h-5 text-cockpit-valid shrink-0 mt-0.5" /> {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON MATRIX */}
      <section className="py-24 bg-cockpit-bg">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Reveal>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="font-heading text-[30px] md:text-[40px] font-bold mb-4">Everything a logbook should do. Most don't.</h2>
              <p className="text-[18px] text-cockpit-muted">The essentials other logbook apps leave out — all built in.</p>
            </div>
            <div className="rounded-2xl border border-cockpit-border bg-cockpit-panel overflow-hidden shadow-sm divide-y divide-cockpit-border">
              <div className="grid grid-cols-[1fr_76px_76px] items-center px-4 md:px-6 py-3 bg-cockpit-bg">
                <span />
                <span className="text-center text-[12px] font-bold text-cockpit-amber">PilotHobb</span>
                <span className="text-center text-[12px] font-bold text-cockpit-muted/60">Others</span>
              </div>
              {COMPARE.map(([label, a, b]) => (
                <div key={label} className="grid grid-cols-[1fr_76px_76px] items-center px-4 md:px-6 py-3.5">
                  <span className="text-[14px] md:text-[15px] text-cockpit-cream">{label}</span>
                  <span className="flex justify-center"><Mark v={a} /></span>
                  <span className="flex justify-center"><Mark v={b} /></span>
                </div>
              ))}
            </div>
            <p className="text-center text-[12px] text-cockpit-muted/60 mt-4">Comparison vs typical general-purpose pilot logbook apps.</p>
          </Reveal>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-cockpit-bg">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading text-[30px] md:text-[40px] font-bold">One subscription. Your whole flying career.</h2>
            <p className="text-[18px] text-cockpit-muted">Start free, keep your logbook for life. Cancel anytime — your data exports to PDF whenever you want it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {TIERS.map((t) =>
            <div key={t.name} className={`rounded-2xl p-8 lg:p-10 flex flex-col relative ${t.highlighted ? "bg-cockpit-panel border-2 border-cockpit-amber/40 shadow-xl md:-mt-2" : "bg-cockpit-panel border border-cockpit-border shadow-sm"}`}>
                {t.highlighted &&
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cockpit-amber text-cockpit-bg px-5 py-1.5 rounded-full text-[11px] tracking-widest font-bold shadow-lg uppercase">Most Popular</div>
              }
                <h3 className="font-heading text-[24px] font-semibold mb-2">{t.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-mono text-4xl font-bold text-cockpit-amber">{t.price}</span>
                </div>
                <p className="text-[13px] text-cockpit-muted mb-8">{t.period}</p>
                <ul className="space-y-4 mb-10 flex-1">
                  {t.features.map((f, i) =>
                <li key={f} className={`flex items-center gap-3 text-[15px] ${i === 0 && t.highlighted ? "text-cockpit-amber font-bold" : "text-cockpit-muted"}`}>
                      {i === 0 && t.highlighted ? <Sparkles className="w-5 h-5 text-cockpit-amber shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-cockpit-valid shrink-0" />}
                      {f}
                    </li>
                )}
                </ul>
                <Link to={t.to} className={`w-full text-center py-4 rounded-xl font-bold transition-all ${t.highlighted ? "bg-cockpit-amber text-cockpit-bg shadow-lg hover:brightness-110" : "border-2 border-cockpit-amber/30 text-cockpit-amber hover:bg-cockpit-amber/5"}`}>{t.cta}</Link>
              </div>
            )}
          </div>
          <p className="text-center text-[13px] text-cockpit-muted mt-8">Prices in ZAR. CSV export is free on every plan — your data is always yours. <Link to="/pricing" className="text-cockpit-amber font-semibold">Compare plans</Link></p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-cockpit-panel">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-[30px] md:text-[40px] font-bold mb-4">Questions, answered.</h2>
            <p className="text-[18px] text-cockpit-muted">Everything pilots ask before they switch.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="rounded-2xl border border-cockpit-border bg-cockpit-bg overflow-hidden">
                  <button onClick={() => setOpenFaq(open ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                    <span className="font-heading text-[17px] font-semibold text-cockpit-cream">{f.q}</span>
                    <ChevronDown className={`w-5 h-5 text-cockpit-amber shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <div className="px-5 pb-5 -mt-1 text-[15px] text-cockpit-muted leading-relaxed">{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-24 bg-cockpit-amber text-cockpit-bg relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <h2 className="font-heading text-[32px] md:text-[42px] font-bold leading-tight">Start your logbook tonight.</h2>
          <p className="text-[20px] text-cockpit-bg/80 max-w-2xl mx-auto">Log your first flight in under a minute. No card required — keep your logbook for life.</p>
          <div className="pt-2">
            <Link to="/register" className="inline-flex items-center gap-2 bg-cockpit-bg text-cockpit-amber px-12 py-5 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold tracking-wide uppercase text-sm">
              Start free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="pt-2"><StoreButtons className="justify-center" /></div>
          <p className="text-cockpit-bg/70 text-xs">iPhone &amp; Android apps go live at launch · start in your browser today.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cockpit-panel pt-20 pb-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-6">
                <Logo size={36} />
              </div>
              <p className="text-[14px] text-cockpit-muted">Your logbook, down to the tenth of an hour. Professional tools for the modern cockpit and remote control station.</p>
            </div>
            <div>
              <h4 className="text-[12px] text-cockpit-cream font-bold mb-6 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4 text-[14px] text-cockpit-muted">
                <li><a className="hover:text-cockpit-amber transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-cockpit-amber transition-colors" href="#pricing">Pricing</a></li>
                <li><Link className="hover:text-cockpit-amber transition-colors" to="/rpas">Drone / RPAS</Link></li>
                <li><Link className="hover:text-cockpit-amber transition-colors" to="/download">Get the app</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[12px] text-cockpit-cream font-bold mb-6 uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-[14px] text-cockpit-muted">
                <li><Link className="hover:text-cockpit-amber transition-colors" to="/about">About</Link></li>
                <li><Link className="hover:text-cockpit-amber transition-colors" to="/faq">FAQ</Link></li>
                <li><Link className="hover:text-cockpit-amber transition-colors" to="/security">Security &amp; data</Link></li>
                <li><Link className="hover:text-cockpit-amber transition-colors" to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[12px] text-cockpit-cream font-bold mb-6 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-[14px] text-cockpit-muted">
                <li><Link className="hover:text-cockpit-amber transition-colors" to="/privacy">Privacy Policy</Link></li>
                <li><Link className="hover:text-cockpit-amber transition-colors" to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cockpit-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] text-cockpit-muted/60">© 2026 PilotHobb. All rights reserved.</p>
            <p className="text-[13px] text-cockpit-muted/60">For SACAA · FAA · EASA · UK CAA · CASA pilots</p>
          </div>
        </div>
      </footer>
    </div>);

}