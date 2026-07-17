import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import DocModal, { Field } from "@/components/documents/DocModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";
import { tap } from "@/lib/haptic";

const SUBJECTS = ["PPL", "CPL", "IR", "Restricted Radio", "General Radio", "Night Rating", "ATPL", "RPL", "Other"];

export default function ExamForm({ exam, onClose, onSaved, onDeleted }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    subject: exam?.subject || "PPL",
    date_written: exam?.date_written || "",
    marks: exam?.marks ?? "",
    passed: exam?.passed ?? false,
    valid_18_months: exam?.valid_18_months || "",
    valid_36_months: exam?.valid_36_months || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    tap();
    if (!form.date_written) { toast({ title: "Date written is required" }); return; }
    setSaving(true);
    try {
      const payload = { ...form, marks: form.marks === "" ? null : Number(form.marks) };
      if (exam?.id) {
        await base44.entities.Exam.update(exam.id, payload);
      } else {
        await base44.entities.Exam.create(payload);
      }
      toast({ title: exam?.id ? "Exam updated" : "Exam added" });
      onSaved?.();
      onClose();
    } catch (e) {
      toast({ title: "Failed to save", description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!exam?.id) return;
    setDeleting(true);
    try {
      await base44.entities.Exam.delete(exam.id);
      toast({ title: "Exam deleted" });
      onDeleted?.();
      onClose();
    } catch (e) {
      toast({ title: "Failed to delete", description: e.message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DocModal
      title={exam?.id ? "Edit exam" : "Add exam"}
      onClose={onClose}
      footer={
        <div className="flex items-center gap-2">
          {exam?.id && (
            <Button variant="outline" onClick={handleDelete} disabled={deleting}
              className="border-cockpit-expired/30 text-cockpit-expired hover:bg-cockpit-expired/10">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose}
            className="border-cockpit-border text-cockpit-muted hover:text-cockpit-cream">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}
            className="bg-cockpit-amber text-cockpit-bg hover:bg-cockpit-amber-hi">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {exam?.id ? "Save" : "Add"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Subject">
          <Select value={form.subject} onValueChange={(v) => set("subject", v)}>
            <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Date written">
          <Input type="date" value={form.date_written} onChange={(e) => set("date_written", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Marks (%)">
            <Input type="number" value={form.marks} onChange={(e) => set("marks", e.target.value)}
              placeholder="75"
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </Field>
          <Field label="Passed">
            <div className="flex items-center h-9">
              <Switch checked={form.passed} onCheckedChange={(v) => set("passed", v)}
                className="data-[state=checked]:bg-cockpit-valid" />
            </div>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Valid 18 months">
            <Input type="date" value={form.valid_18_months} onChange={(e) => set("valid_18_months", e.target.value)}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </Field>
          <Field label="Valid 36 months">
            <Input type="date" value={form.valid_36_months} onChange={(e) => set("valid_36_months", e.target.value)}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </Field>
        </div>
      </div>
    </DocModal>
  );
}