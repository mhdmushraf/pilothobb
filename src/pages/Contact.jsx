import React, { useState } from "react";
import { Mail, Send, CheckCircle2, Twitter, Linkedin, Github } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import Seo from "@/components/Seo";

// Inline, self-hosted aviation banner (no external image dependency).
const BANNER_SVG = `<svg viewBox="0 0 1600 420" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A1F9E"/><stop offset="0.42" stop-color="#4F46E5"/><stop offset="0.72" stop-color="#7C6FF0"/><stop offset="0.9" stop-color="#F6A45C"/><stop offset="1" stop-color="#FBC98B"/></linearGradient><radialGradient id="sun" cx="0.72" cy="0.98" r="0.5"><stop offset="0" stop-color="#FFE9C7" stop-opacity="0.95"/><stop offset="0.35" stop-color="#FBC98B" stop-opacity="0.55"/><stop offset="1" stop-color="#FBC98B" stop-opacity="0"/></radialGradient><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter><filter id="soft2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter></defs><rect width="1600" height="420" fill="url(#sky)"/><rect width="1600" height="420" fill="url(#sun)"/><g fill="#fff" opacity="0.5"><circle cx="180" cy="70" r="1.6"/><circle cx="420" cy="50" r="1.2"/><circle cx="900" cy="60" r="1.4"/><circle cx="1240" cy="46" r="1.2"/><circle cx="1440" cy="90" r="1.5"/><circle cx="640" cy="90" r="1.1"/></g><g filter="url(#soft)"><ellipse cx="300" cy="360" rx="360" ry="42" fill="#fff" opacity="0.22"/><ellipse cx="1150" cy="378" rx="440" ry="48" fill="#fff" opacity="0.28"/><ellipse cx="780" cy="392" rx="520" ry="44" fill="#FFE3C2" opacity="0.5"/></g><g filter="url(#soft2)" opacity="0.9"><ellipse cx="1180" cy="356" rx="150" ry="20" fill="#fff" opacity="0.55"/><ellipse cx="360" cy="344" rx="120" ry="16" fill="#fff" opacity="0.45"/></g><path d="M120 300 Q 700 250 1180 150" stroke="#fff" stroke-width="5" fill="none" opacity="0.35" stroke-linecap="round"/><path d="M120 300 Q 700 250 1180 150" stroke="#fff" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round" stroke-dasharray="2 10"/><g transform="translate(1180,150) rotate(-24)" fill="#0F1024"><path d="M0 0 L64 -6 L92 0 L64 6 Z"/><path d="M40 -3 L52 -30 L60 -30 L54 -2 Z"/><path d="M40 3 L52 30 L60 30 L54 2 Z"/><path d="M6 -2 L-16 -12 L-10 0 L-16 12 L6 2 Z"/></g></svg>`;
const BANNER_URI = `data:image/svg+xml;utf8,${encodeURIComponent(BANNER_SVG)}`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await base44.functions.invoke("sendContactMessage", form);
      if (res.data?.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setError(res.data?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Seo
        path="/contact"
        title="Contact PilotHobb"
        description="Get in touch with the PilotHobb team about the digital pilot logbook app, SACAA logbook exports, or drone (RPAS) hour tracking."
      />
      <PageHeader
        eyebrow="Contact"
        title="Let's talk."
        subtitle="Questions, feedback, or partnership ideas — we'd love to hear from you."
      />

      {/* Hero image band */}
      <section className="px-4 sm:px-6 -mt-6 mb-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-cockpit-border shadow-xl shadow-cockpit-amber/10">
          <img
            src={BANNER_URI}
            alt="A jet climbing through a dusk sky"
            className="w-full h-40 sm:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cockpit-bg/80 via-cockpit-bg/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <p className="font-heading text-lg sm:text-xl font-bold text-white drop-shadow">
              We usually reply within one business day.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact methods */}
          <ScrollReveal className="lg:col-span-2">
            <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 h-full space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-cockpit-cream mb-1">
                  Reach us directly
                </h2>
                <p className="text-sm text-cockpit-muted">
                  We typically reply within one business day.
                </p>
              </div>

              <a
                href="mailto:hello@linkzoneglobal.com"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-cockpit-amber/10 border border-cockpit-amber/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-cockpit-amber" />
                </div>
                <div>
                  <p className="text-xs text-cockpit-muted">Email</p>
                  <p className="text-sm font-medium text-cockpit-cream group-hover:text-cockpit-amber transition-colors">
                    hello@linkzoneglobal.com
                  </p>
                </div>
              </a>

              <div>
                <p className="text-xs text-cockpit-muted mb-3">Follow us</p>
                <div className="flex gap-3">
                  {[
                    { icon: Twitter, label: "Twitter" },
                    { icon: Linkedin, label: "LinkedIn" },
                    { icon: Github, label: "GitHub" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-xl bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center text-cockpit-muted hover:text-cockpit-amber hover:border-cockpit-amber/30 transition-colors"
                    >
                      <s.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-cockpit-border">
                <p className="text-xs text-cockpit-muted leading-relaxed">
                  PilotHobb · a Linkzone Global FZCO venture
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact form */}
          <ScrollReveal delay={100} className="lg:col-span-3">
            <div className="rounded-2xl bg-cockpit-panel border border-cockpit-border p-6 sm:p-8 h-full">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-cockpit-valid/10 border border-cockpit-valid/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7 text-cockpit-valid" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-cockpit-cream mb-2">
                    Message sent!
                  </h3>
                  <p className="text-sm text-cockpit-muted mb-6 max-w-sm">
                    Thanks for reaching out. We'll get back to you shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStatus("idle")}
                    className="border-cockpit-border text-cockpit-cream hover:bg-cockpit-panel-light"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-cockpit-muted mb-1.5">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="Your name"
                      className="bg-cockpit-bg border-cockpit-border text-cockpit-cream placeholder:text-cockpit-muted/60"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-cockpit-muted mb-1.5">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      placeholder="you@example.com"
                      className="bg-cockpit-bg border-cockpit-border text-cockpit-cream placeholder:text-cockpit-muted/60"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-cockpit-muted mb-1.5">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      maxLength={5000}
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="bg-cockpit-bg border-cockpit-border text-cockpit-cream placeholder:text-cockpit-muted/60 resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-cockpit-expired">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-cockpit-amber text-cockpit-bg font-semibold hover:shadow-lg hover:shadow-cockpit-amber/30"
                  >
                    {status === "sending" ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}