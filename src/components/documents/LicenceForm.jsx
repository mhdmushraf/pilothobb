import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import DocModal, { Field } from "@/components/documents/DocModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";

const CATEGORIES = ["Licence", "Rating", "Medical", "Operator Approval"];
const DISCIPLINES = ["Manned", "RPAS"];
const FRAMEWORKS = ["SACAA", "FAA", "EASA", "UK CAA", "CASA", "Other"];

export default function LicenceForm({ licence, onClose, onSaved, onDeleted }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: licence?.name || "",
    category: licence?.category || "Licence",
    discipline: licence?.discipline || "Manned",
    framework: licence?.framework || "SACAA",
    issue_date: licence?.issue_date || "",
    expiry_date: licence?.expiry_date || "",
    notes: licence?.notes || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Name is required" }); return; }
    setSaving(true);
    try {
      if (licence?.id) {
        await base44.entities.Licence.update(licence.id, form);
      } else {
        await base44.entities.Licence.create(form);
      }
      toast({ title: licence?.id ? "Document updated" : "Document added" });
      onSaved?.();
      onClose();
    } catch (e) {
      toast({ title: "Failed to save", description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!licence?.id) return;
    setDeleting(true);
    try {
      await base44.entities.Licence.delete(licence.id);
      toast({ title: "Document deleted" });
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
      title={licence?.id ? "Edit document" : "Add document"}
      onClose={onClose}
      footer={
        <div className="flex items-center gap-2">
          {licence?.id && (
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
            {licence?.id ? "Save" : "Add"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. PPL Licence"
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream" />
        </Field>
        <Field label="Category">
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Discipline">
          <Select value={form.discipline} onValueChange={(v) => set("discipline", v)}>
            <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DISCIPLINES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Framework / Authority">
          <Select value={form.framework} onValueChange={(v) => set("framework", v)}>
            <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FRAMEWORKS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Issue date">
            <Input type="date" value={form.issue_date} onChange={(e) => set("issue_date", e.target.value)}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </Field>
          <Field label="Expiry date">
            <Input type="date" value={form.expiry_date} onChange={(e) => set("expiry_date", e.target.value)}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </Field>
        </div>
        <Field label="Notes">
          <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream resize-none" />
        </Field>
      </div>
    </DocModal>
  );
}