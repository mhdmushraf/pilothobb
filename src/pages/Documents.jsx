import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Award, Plane, Plus, ShieldCheck } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";
import { ExpiryRing, dayDiff } from "@/components/documents/LicenceDetail";
import LicenceForm from "@/components/documents/LicenceForm";
import ExamForm from "@/components/documents/ExamForm";
import EndorsementForm from "@/components/documents/EndorsementForm";
import AppHeader from "@/components/AppHeader";
import SectionTitle from "@/components/SectionTitle";

function DocSection({ title, icon: Icon, action, items, loading, emptyText, renderItem }) {
  return (
    <div className="mb-6">
      <SectionTitle icon={Icon} action={action}>{title}</SectionTitle>
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

function AddButton({ label, onClick }) {
  return (
    <button onClick={onClick}
      className="text-xs text-cockpit-amber flex items-center gap-0.5 hover:text-cockpit-amber-hi">
      <Plus className="w-3 h-3" /> {label}
    </button>
  );
}

function LicenceCard({ licence, onClick }) {
  const days = dayDiff(licence.expiry_date);
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl bg-cockpit-panel border border-cockpit-border p-3 hover:border-cockpit-amber/20 transition-colors"
    >
      <div className="flex items-center gap-3">
        <ExpiryRing days={days} size={44} stroke={4} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-cockpit-cream truncate">{licence.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {licence.framework && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-cockpit-valid/10 text-cockpit-valid">
                {licence.framework}
              </span>
            )}
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-cockpit-amber/10 text-cockpit-amber">
              {licence.category}
            </span>
          </div>
          <p className="text-[11px] text-cockpit-muted mt-1">
            {days === null ? "No expiry" : days <= 0 ? "Expired" : `${days} days left`}
          </p>
        </div>
      </div>
    </button>
  );
}

function ExamCard({ exam, onClick, examColor }) {
  return (
    <button key={exam.id} onClick={onClick}
      className="w-full text-left rounded-xl bg-cockpit-panel border border-cockpit-border p-3 hover:border-cockpit-amber/20 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-cockpit-cream">{exam.subject}</span>
        <span className={`font-mono text-sm font-bold ${exam.passed ? "text-cockpit-valid" : "text-cockpit-expired"}`}>
          {exam.marks ?? "—"}%
        </span>
      </div>
      <div className="flex gap-3 text-xs text-cockpit-muted font-mono">
        <span>{exam.date_written ? new Date(exam.date_written).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>
        <span className={examColor(exam.valid_18_months)}>
          18m: {exam.valid_18_months ? new Date(exam.valid_18_months).toLocaleDateString("en-GB", { month: "short", year: "2-digit" }) : "—"}
        </span>
      </div>
    </button>
  );
}

function EndorsementCard({ endorsement, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full text-left rounded-xl bg-cockpit-panel border border-cockpit-border p-3 hover:border-cockpit-amber/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-cockpit-valid/10 border border-cockpit-valid/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-cockpit-valid" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-cockpit-cream truncate">{endorsement.title}</p>
          {endorsement.date && (
            <p className="text-[11px] text-cockpit-muted mt-0.5 font-mono">
              {new Date(endorsement.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default function Documents() {
  const [exams, setExams] = useState(null);
  const [manned, setManned] = useState(null);
  const [rpas, setRpas] = useState(null);
  const [endorsements, setEndorsements] = useState(null);
  const [licenceModal, setLicenceModal] = useState(null);
  const [examModal, setExamModal] = useState(null);
  const [endorsementModal, setEndorsementModal] = useState(null);

  const loadExams = () =>
    base44.entities.Exam.list("-date_written", 30).then(setExams).catch(() => setExams([]));
  const loadLicences = () =>
    base44.entities.Licence.list("expiry_date", 100)
      .then((all) => {
        setManned(all.filter((l) => l.discipline !== "RPAS"));
        setRpas(all.filter((l) => l.discipline === "RPAS"));
      })
      .catch(() => { setManned([]); setRpas([]); });
  const loadEndorsements = () =>
    base44.entities.Endorsement.list("-date", 50).then(setEndorsements).catch(() => setEndorsements([]));

  useEffect(() => {
    loadExams();
    loadLicences();
    loadEndorsements();
  }, []);

  const examColor = (dateStr) => {
    if (!dateStr) return "text-cockpit-muted";
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return "text-cockpit-expired";
    if (days <= 90) return "text-cockpit-warning";
    return "text-cockpit-valid";
  };

  return (
    <div className="px-4 pt-6">
      <AppHeader
        icon={FileText}
        title="Documents"
        subtitle="Licences · currency · exams"
        action={<AddButton label="Add" onClick={() => setLicenceModal({})} />}
      />

      <DocSection
        title="Exams"
        icon={FileText}
        action={<AddButton label="Add exam" onClick={() => setExamModal({})} />}
        items={exams || []}
        loading={exams === null}
        emptyText="No exams recorded yet"
        renderItem={(exam) => (
          <ExamCard key={exam.id} exam={exam} examColor={examColor} onClick={() => setExamModal(exam)} />
        )}
      />

      <DocSection
        title="Manned"
        icon={Award}
        items={manned || []}
        loading={manned === null}
        emptyText="No manned licences or ratings tracked yet"
        renderItem={(l) => (
          <LicenceCard key={l.id} licence={l} onClick={() => setLicenceModal(l)} />
        )}
      />

      <DocSection
        title="RPAS — drone credentials"
        icon={Plane}
        items={rpas || []}
        loading={rpas === null}
        emptyText="No RPAS credentials tracked yet"
        renderItem={(l) => (
          <LicenceCard key={l.id} licence={l} onClick={() => setLicenceModal(l)} />
        )}
      />

      <DocSection
        title="Endorsements"
        icon={ShieldCheck}
        action={<AddButton label="Add endorsement" onClick={() => setEndorsementModal({})} />}
        items={endorsements || []}
        loading={endorsements === null}
        emptyText="No endorsements recorded yet"
        renderItem={(e) => (
          <EndorsementCard key={e.id} endorsement={e} onClick={() => setEndorsementModal(e)} />
        )}
      />

      {licenceModal && (
        <LicenceForm
          licence={licenceModal.id ? licenceModal : null}
          onClose={() => setLicenceModal(null)}
          onSaved={loadLicences}
          onDeleted={loadLicences}
        />
      )}
      {examModal && (
        <ExamForm
          exam={examModal.id ? examModal : null}
          onClose={() => setExamModal(null)}
          onSaved={loadExams}
          onDeleted={loadExams}
        />
      )}
      {endorsementModal && (
        <EndorsementForm
          endorsement={endorsementModal.id ? endorsementModal : null}
          onClose={() => setEndorsementModal(null)}
          onSaved={loadEndorsements}
          onDeleted={loadEndorsements}
        />
      )}
    </div>
  );
}