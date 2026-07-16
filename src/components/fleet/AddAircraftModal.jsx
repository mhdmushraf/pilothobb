import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { X, Plus, Loader2 } from "lucide-react";

const CATEGORIES = ["SEP", "MEP", "Helicopter", "Drone (RPAS)", "Other"];
const TIME_SOURCES = ["Hobbs", "Tach", "Manual"];
const WEIGHT_CLASSES = ["< 250 g", "250 g – 2 kg", "2 – 7 kg", "7 – 25 kg", "> 25 kg", "Manned"];

export default function AddAircraftModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    registration: "",
    type: "",
    category: "SEP",
    time_source: "Hobbs",
    current_reading: 0,
    weight_class: "",
    serial_number: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isDrone = form.category === "Drone (RPAS)";
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onCategoryChange = (val) => {
    if (val === "Drone (RPAS)") {
      setForm((f) => ({ ...f, category: val, time_source: "Manual" }));
    } else {
      setForm((f) => ({ ...f, category: val }));
    }
  };

  const handleSave = async () => {
    setError(null);
    if (!form.registration || !form.type) {
      setError("Registration and type are required.");
      return;
    }
    setSaving(true);
    try {
      await base44.entities.Aircraft.create({
        registration: form.registration,
        type: form.type,
        category: form.category,
        time_source: form.time_source,
        current_reading: Number(form.current_reading) || 0,
        weight_class: isDrone ? form.weight_class || undefined : undefined,
        serial_number: isDrone ? form.serial_number || undefined : undefined,
      });
      onSaved();
    } catch (e) {
      setError(e.message || "Failed to save aircraft.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-cockpit-panel border border-cockpit-border p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-cockpit-cream flex items-center gap-2">
            <Plus className="w-4 h-4 text-cockpit-amber" /> Add Aircraft
          </h2>
          <button onClick={onClose} className="p-1 text-cockpit-muted hover:text-cockpit-cream">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Registration *</Label>
            <Input value={form.registration} onChange={(e) => set("registration", e.target.value)}
              placeholder="ZS-ABC"
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Type *</Label>
            <Input value={form.type} onChange={(e) => set("type", e.target.value)}
              placeholder="Cessna 172"
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Category</Label>
            <Select value={form.category} onValueChange={onCategoryChange}>
              <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Time source</Label>
            <Select value={form.time_source} onValueChange={(v) => set("time_source", v)} disabled={isDrone}>
              <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_SOURCES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            {isDrone && <p className="text-[11px] text-cockpit-muted">Auto-set to Manual for drones</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Current reading (hrs)</Label>
            <Input type="number" step="0.1" value={form.current_reading}
              onChange={(e) => set("current_reading", e.target.value)}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </div>
          {isDrone && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Weight class</Label>
                <Select value={form.weight_class} onValueChange={(v) => set("weight_class", v)}>
                  <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEIGHT_CLASSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Serial number</Label>
                <Input value={form.serial_number} onChange={(e) => set("serial_number", e.target.value)}
                  className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
              </div>
            </>
          )}
        </div>

        {error && <p className="text-xs text-cockpit-expired mt-3">{error}</p>}

        <div className="flex gap-3 mt-5">
          <Button variant="outline" onClick={onClose} className="flex-1 border-cockpit-border text-cockpit-muted">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}
            className="flex-1 bg-cockpit-amber text-cockpit-bg hover:bg-cockpit-amber-hi">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {saving ? "Saving…" : "Add aircraft"}
          </Button>
        </div>
      </div>
    </div>
  );
}