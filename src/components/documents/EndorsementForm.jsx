import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import DocModal, { Field } from "@/components/documents/DocModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { tap } from "@/lib/haptic";

export default function EndorsementForm({ endorsement, onClose, onSaved, onDeleted }) {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: endorsement?.title || "",
    date: endorsement?.date || "",
    description: endorsement?.description || "",
    page_image: endorsement?.page_image || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("page_image", file_url);
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: "Upload failed" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    tap();
    if (!form.title.trim()) { toast({ title: "Title is required" }); return; }
    setSaving(true);
    try {
      if (endorsement?.id) {
        await base44.entities.Endorsement.update(endorsement.id, form);
      } else {
        await base44.entities.Endorsement.create(form);
      }
      toast({ title: endorsement?.id ? "Endorsement updated" : "Endorsement added" });
      onSaved?.();
      onClose();
    } catch (e) {
      toast({ title: "Failed to save", description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!endorsement?.id) return;
    setDeleting(true);
    try {
      await base44.entities.Endorsement.delete(endorsement.id);
      toast({ title: "Endorsement deleted" });
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
      title={endorsement?.id ? "Edit endorsement" : "Add endorsement"}
      onClose={onClose}
      footer={
        <div className="flex items-center gap-2">
          {endorsement?.id && (
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
            {endorsement?.id ? "Save" : "Add"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Title">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Complex aircraft endorsement"
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream" />
        </Field>
        <Field label="Date">
          <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <Field label="Description">
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream resize-none" />
        </Field>
        <Field label="Logbook page image">
          <input ref={fileRef} type="file" accept="image/*" capture="environment"
            className="hidden" onChange={handleUpload} />
          {form.page_image ? (
            <div className="relative rounded-xl overflow-hidden border border-cockpit-border">
              <img src={form.page_image} alt="Endorsement page" className="w-full h-40 object-cover" />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="absolute bottom-2 right-2 rounded-lg bg-cockpit-bg/80 px-2 py-1 text-xs text-cockpit-cream flex items-center gap-1">
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Replace
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="w-full rounded-xl border border-dashed border-cockpit-border bg-cockpit-panel py-6 flex flex-col items-center gap-2 text-cockpit-muted text-sm">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              {uploading ? "Uploading…" : "Upload page image"}
            </button>
          )}
        </Field>
      </div>
    </DocModal>
  );
}