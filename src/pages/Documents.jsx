import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Award, Heart } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";

function DocSection({ title, icon: Icon, items, loading, emptyText, renderItem }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-cockpit-muted uppercase tracking-wider flex items-center gap-1.5 mb-3">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h2>
      {loading ? (
        <SkeletonCard lines={2} />
      ) : items.length === 0 ? (
        <div className="rounded-xl bg-cockpit-panel border border-cockpit-border p-4 text-center">
          <p className="text-xs text-cockpit-muted">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(renderItem)}
        </div>
      )}
    </div>
  );
}

export default function Documents() {
  const [exams, setExams] = useState(null);
  const [licencesRatings, setLicencesRatings] = useState(null);
  const [medicals, setMedicals] = useState(null);

  useEffect(() => {
    base44.entities.Exam.list("-date_written", 30).then(setExams).catch(() => setExams([]));
    base44.entities.Licence.list("-expiry_date", 30).then((all) => {
      setLicencesRatings(all.filter((l) => l.category !== "Medical"));
      setMedicals(all.filter((l) => l.category === "Medical"));
    }).catch(() => { setLicencesRatings([]); setMedicals([]); });
  }, []);

  const expiryColor = (dateStr) => {
    if (!dateStr) return "text-cockpit-muted";
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return "text-cockpit-expired";
    if (days <= 90) return "text-cockpit-warning";
    return "text-cockpit-valid";
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-cockpit-cream mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-cockpit-amber" /> Documents
      </h1>

      <DocSection
        title="Exams"
        icon={FileText}
        items={exams || []}
        loading={exams === null}
        emptyText="No exams recorded yet"
        renderItem={(exam) => (
          <div key={exam.id} className="rounded-xl bg-cockpit-panel border border-cockpit-border p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-cockpit-cream">{exam.subject}</span>
              <span className={`font-mono text-sm font-bold ${exam.passed ? "text-cockpit-valid" : "text-cockpit-expired"}`}>
                {exam.marks ?? "—"}%
              </span>
            </div>
            <div className="flex gap-3 text-xs text-cockpit-muted font-mono">
              <span>{exam.date_written ? new Date(exam.date_written).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
              <span className={expiryColor(exam.valid_18_months)}>
                18m: {exam.valid_18_months ? new Date(exam.valid_18_months).toLocaleDateString("en-GB", { month: "short", year: "2-digit" }) : "—"}
              </span>
            </div>
          </div>
        )}
      />

      <DocSection
        title="Licences & Ratings"
        icon={Award}
        items={licencesRatings || []}
        loading={licencesRatings === null}
        emptyText="No licences or ratings tracked yet"
        renderItem={(l) => (
          <div key={l.id} className="rounded-xl bg-cockpit-panel border border-cockpit-border p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-cockpit-cream">{l.name}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${l.category === "Rating" ? "bg-cockpit-amber/10 text-cockpit-amber" : "bg-cockpit-valid/10 text-cockpit-valid"}`}>
                {l.category}
              </span>
            </div>
            {l.expiry_date && (
              <p className={`text-xs font-mono ${expiryColor(l.expiry_date)}`}>
                Expires {new Date(l.expiry_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
        )}
      />

      <DocSection
        title="Medical"
        icon={Heart}
        items={medicals || []}
        loading={medicals === null}
        emptyText="No medical certificates tracked yet"
        renderItem={(m) => (
          <div key={m.id} className="rounded-xl bg-cockpit-panel border border-cockpit-border p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-cockpit-cream">{m.name}</span>
            </div>
            {m.expiry_date && (
              <p className={`text-xs font-mono ${expiryColor(m.expiry_date)}`}>
                Expires {new Date(m.expiry_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}