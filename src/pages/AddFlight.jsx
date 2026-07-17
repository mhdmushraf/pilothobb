import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import usePilot from "@/hooks/usePilot";
import { computeTotals } from "@/lib/flightTotals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Plus, ChevronLeft, ChevronRight, Camera, Plane, Check, Minus, Loader2, Shield, Pencil,
} from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";

const r1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
const todayStr = () => new Date().toISOString().split("T")[0];

const ROLE_TIME_FIELD = {
  PIC: "pic_time",
  Dual: "dual_time",
  PICUS: "picus_time",
  "Co-pilot": "co_pilot_time",
};

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-cockpit-muted uppercase tracking-wider">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-cockpit-muted">{hint}</p>}
    </div>
  );
}

function Stepper({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
        className="w-9 h-9 rounded-lg bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center text-cockpit-cream">
        <Minus className="w-4 h-4" />
      </button>
      <span className="font-mono text-lg font-bold text-cockpit-cream w-8 text-center">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}
        className="w-9 h-9 rounded-lg bg-cockpit-panel-light border border-cockpit-border flex items-center justify-center text-cockpit-cream">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function StepDots({ step, isRpas }) {
  const steps = isRpas ? [1, 2, 4, 5] : [1, 2, 3, 4, 5];
  const labels = { 1: "Aircraft", 2: "Time", 3: "Route", 4: "Role", 5: "Review" };
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-1.5 ${s === step ? "text-cockpit-amber" : s < step ? "text-cockpit-valid" : "text-cockpit-muted"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border ${
              s === step ? "bg-cockpit-amber/15 border-cockpit-amber text-cockpit-amber"
              : s < step ? "bg-cockpit-valid/15 border-cockpit-valid text-cockpit-valid"
              : "bg-cockpit-panel border-cockpit-border"
            }`}>
              {s < step ? <Check className="w-3 h-3" /> : s}
            </div>
            <span className="text-[11px] hidden sm:inline">{labels[s]}</span>
          </div>
          {i < steps.length - 1 && <div className="flex-1 h-px bg-cockpit-border" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function AddFlight() {
  const { pilot, loading: pilotLoading } = usePilot();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const isEdit = !!id;

  const [step, setStep] = useState(1);
  const [aircraftList, setAircraftList] = useState(null);
  const [aircraft, setAircraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [originalFlight, setOriginalFlight] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    reading_before: 0,
    reading_after: 0,
    flight_time: 0,
    mission_type: "",
    operation_category: "",
    battery_cycles: 0,
    observer: "",
    launch_site: "",
    recovery_site: "",
    from_aerodrome: "",
    to_aerodrome: "",
    stops: [{ name: "", tg: 0 }],
    manualCounts: false,
    takeoffs: 1,
    landings: 1,
    pilot_role: "PIC",
    night_time: 0,
    night_landings: 0,
    night_takeoffs: 0,
    xc_time: 0,
    instrument_actual: 0,
    instrument_sim: 0,
    sim_time: 0,
    autorotations: 0,
    hoist_cycles: 0,
    remarks: "",
  });

  useEffect(() => {
    base44.entities.Aircraft.list()
      .then(setAircraftList)
      .catch(() => setAircraftList([]));
  }, []);

  useEffect(() => {
    if (!isEdit || !id || !aircraftList) return;
    base44.entities.Flight.get(id).then((flight) => {
      setOriginalFlight(flight);
      const acId = typeof flight.aircraft === "string" ? flight.aircraft : flight.aircraft?.id;
      const ac = aircraftList.find((a) => a.id === acId);
      if (ac) setAircraft(ac);
      setForm((f) => ({
        ...f,
        reading_before: flight.reading_before ?? 0,
        reading_after: flight.reading_after ?? 0,
        flight_time: flight.flight_time ?? 0,
        mission_type: flight.mission_type || "",
        operation_category: flight.operation_category || "",
        battery_cycles: flight.battery_cycles ?? 0,
        observer: flight.observer || "",
        launch_site: flight.from_aerodrome || "",
        recovery_site: flight.to_aerodrome || "",
        from_aerodrome: flight.from_aerodrome || "",
        to_aerodrome: flight.to_aerodrome || "",
        stops: [{ name: "", tg: flight.touch_and_go || 0 }],
        manualCounts: false,
        takeoffs: flight.takeoffs ?? 1,
        landings: flight.landings ?? 1,
        pilot_role: flight.pilot_role || "PIC",
        night_time: flight.night_time ?? 0,
        night_landings: flight.night_landings ?? 0,
        night_takeoffs: flight.night_takeoffs ?? 0,
        xc_time: flight.xc_time ?? 0,
        instrument_actual: flight.instrument_actual ?? 0,
        instrument_sim: flight.instrument_sim ?? 0,
        sim_time: flight.sim_time ?? 0,
        autorotations: flight.autorotations ?? 0,
        hoist_cycles: flight.hoist_cycles ?? 0,
        remarks: flight.remarks || "",
      }));
    }).catch(() => {
      toast({ title: "Flight not found", variant: "destructive" });
      navigate("/logbook");
    });
  }, [id, aircraftList, isEdit]);

  const isRpas = aircraft?.category === "Drone (RPAS)";
  const isHeli = aircraft?.category === "Helicopter";

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const selectAircraft = (ac) => {
    setAircraft(ac);
    setForm((f) => ({
      ...f,
      reading_before: ac?.current_reading ?? 0,
      flight_time: 0,
      reading_after: ac?.current_reading ?? 0,
    }));
  };

  const handleScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: "This is a photo of an aircraft Hobbs or Tachometer meter. Read the number shown on the counter, including the tenths digit. Return only the numeric reading.",
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            reading: { type: "number" },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
          },
          required: ["reading"],
        },
      });
      const reading = r1(result.reading);
      set("reading_after", reading);
      toast({ title: `Meter read: ${reading} (${result.confidence || "—"})` });
    } catch {
      toast({ title: "Couldn't read the meter — enter it manually." });
    } finally {
      setScanning(false);
      e.target.value = "";
    }
  };

  const touchAndGo = form.stops.reduce((s, st) => s + (Number(st.tg) || 0), 0);
  const autoTakeoffs = 1 + touchAndGo;
  const autoLandings = 1 + touchAndGo;
  const takeoffs = form.manualCounts ? Number(form.takeoffs) || 0 : autoTakeoffs;
  const landings = form.manualCounts ? Number(form.landings) || 0 : autoLandings;

  const mannedFlightTime = r1((Number(form.reading_after) || 0) - (Number(form.reading_before) || 0));
  const flightTime = isRpas ? r1(form.flight_time) : mannedFlightTime;
  const roleField = ROLE_TIME_FIELD[form.pilot_role];

  const nextStep = () => {
    if (step === 2 && isRpas) setStep(4);
    else setStep(step + 1);
  };
  const prevStep = () => {
    if (step === 4 && isRpas) setStep(2);
    else setStep(step - 1);
  };

  const updateStop = (idx, key, val) => {
    setForm((f) => ({
      ...f,
      stops: f.stops.map((s, i) => (i === idx ? { ...s, [key]: val } : s)),
    }));
  };
  const addStop = () => setForm((f) => ({ ...f, stops: [...f.stops, { name: "", tg: 0 }] }));
  const removeStop = (idx) => setForm((f) => ({ ...f, stops: f.stops.filter((_, i) => i !== idx) }));

  const canContinue = () => {
    if (step === 1) return !!aircraft;
    if (step === 2 && !isRpas) return (Number(form.reading_after) || 0) > (Number(form.reading_before) || 0);
    if (step === 2 && isRpas) return (Number(form.flight_time) || 0) > 0;
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    let created = null;
    try {
      const flightData = {
        date: isEdit ? originalFlight.date : todayStr(),
        aircraft: aircraft.id,
        is_rpas: isRpas,
        flight_time: flightTime,
        pilot_role: form.pilot_role,
        night_time: r1(form.night_time),
        night_landings: Number(form.night_landings) || 0,
        night_takeoffs: Number(form.night_takeoffs) || 0,
        xc_time: r1(form.xc_time),
        instrument_actual: r1(form.instrument_actual),
        instrument_sim: r1(form.instrument_sim),
        sim_time: r1(form.sim_time),
        remarks: form.remarks,
      };

      if (isRpas) {
        flightData.from_aerodrome = form.launch_site;
        flightData.to_aerodrome = form.recovery_site;
        flightData.mission_type = form.mission_type || undefined;
        flightData.operation_category = form.operation_category || undefined;
        flightData.battery_cycles = Number(form.battery_cycles) || 0;
        flightData.observer = form.observer;
        flightData.takeoffs = 1;
        flightData.landings = 1;
      } else {
        flightData.reading_before = Number(form.reading_before) || 0;
        flightData.reading_after = Number(form.reading_after) || 0;
        flightData.from_aerodrome = form.from_aerodrome;
        flightData.to_aerodrome = form.to_aerodrome;
        flightData.touch_and_go = touchAndGo;
        flightData.takeoffs = takeoffs;
        flightData.landings = landings;
      }

      flightData[roleField] = flightTime;
      if (isHeli) {
        flightData.autorotations = Number(form.autorotations) || 0;
        flightData.hoist_cycles = Number(form.hoist_cycles) || 0;
      }

      if (isEdit) {
        const rev = computeTotals(originalFlight, pilot, aircraft, -1);
        await base44.entities.Pilot.update(pilot.id, rev.pilotPatch);
        if (aircraft) await base44.entities.Aircraft.update(aircraft.id, rev.aircraftPatch);

        await base44.entities.Flight.update(id, flightData);

        const add = computeTotals({ ...flightData, id }, rev.pilotPatch, rev.aircraftPatch, 1);
        await base44.entities.Pilot.update(pilot.id, add.pilotPatch);
        if (aircraft) await base44.entities.Aircraft.update(aircraft.id, add.aircraftPatch);

        toast({ title: "Flight updated" });
        navigate("/logbook");
      } else {
        created = await base44.entities.Flight.create(flightData);

        const { pilotPatch, aircraftPatch } = computeTotals(created, pilot, aircraft, 1);
        await base44.entities.Pilot.update(pilot.id, pilotPatch);
        await base44.entities.Aircraft.update(aircraft.id, aircraftPatch);

        toast({ title: "Flight saved" });
        navigate("/logbook");
      }
    } catch (e) {
      if (created) {
        try { await base44.entities.Flight.delete(created.id); } catch { /* best-effort cleanup */ }
      }
      setError(e.message || "Failed to save flight. Totals were not applied.");
      setSaving(false);
    }
  };

  /* ----- STEP 1: Aircraft ----- */
  const Step1 = (
    <div className="space-y-3">
      {aircraftList === null ? (
        <SkeletonCard lines={3} />
      ) : aircraftList.length === 0 ? (
        <div className="rounded-xl bg-cockpit-panel border border-cockpit-border p-6 text-center">
          <p className="text-sm text-cockpit-muted">No aircraft in your fleet yet.</p>
          <Button variant="outline" className="mt-3" onClick={() => navigate("/fleet")}>Add aircraft</Button>
        </div>
      ) : (
        aircraftList.map((ac) => (
          <button key={ac.id} type="button" onClick={() => selectAircraft(ac)}
            className={`w-full text-left rounded-xl p-4 border transition-colors ${
              aircraft?.id === ac.id
                ? "bg-cockpit-amber/10 border-cockpit-amber/40"
                : "bg-cockpit-panel border-cockpit-border hover:border-cockpit-amber/20"
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-bold text-cockpit-cream">{ac.registration}</p>
                <p className="text-xs text-cockpit-muted">{ac.type} · {ac.category}</p>
              </div>
              {aircraft?.id === ac.id && <Check className="w-5 h-5 text-cockpit-amber" />}
            </div>
            <p className="text-[11px] text-cockpit-muted mt-1 font-mono">
              {ac.time_source} · {ac.current_reading ?? 0} hrs
            </p>
          </button>
        ))
      )}
    </div>
  );

  /* ----- STEP 2: Time ----- */
  const Step2 = isRpas ? (
    <div className="space-y-4">
      <Field label="Flight time (hrs)">
        <Input type="number" step="0.1" value={form.flight_time}
          onChange={(e) => set("flight_time", e.target.value)}
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
      </Field>
      <Field label="Mission type">
        <Select value={form.mission_type} onValueChange={(v) => set("mission_type", v)}>
          <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
            <SelectValue placeholder="Select mission" />
          </SelectTrigger>
          <SelectContent>
            {["Training", "Commercial", "Recreational", "Survey/Mapping", "Inspection", "Photography/Film", "Agriculture", "Other"].map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Operation category">
        <Select value={form.operation_category} onValueChange={(v) => set("operation_category", v)}>
          <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {["VLOS", "EVLOS", "BVLOS"].map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Battery cycles">
        <Input type="number" step="1" value={form.battery_cycles}
          onChange={(e) => set("battery_cycles", e.target.value)}
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
      </Field>
      <Field label="Observer">
        <Input value={form.observer} onChange={(e) => set("observer", e.target.value)}
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream" />
      </Field>
      <Field label="Launch site">
        <Input value={form.launch_site} onChange={(e) => set("launch_site", e.target.value)}
          placeholder="e.g. Site Alpha"
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream" />
      </Field>
      <Field label="Recovery site">
        <Input value={form.recovery_site} onChange={(e) => set("recovery_site", e.target.value)}
          placeholder="e.g. Site Alpha"
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream" />
      </Field>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="rounded-xl bg-cockpit-panel-light border border-cockpit-border p-3 flex items-center gap-2">
        <Plane className="w-4 h-4 text-cockpit-amber shrink-0" />
        <p className="text-xs text-cockpit-muted">
          {aircraft?.registration} · {aircraft?.time_source} source
        </p>
      </div>
      <Field label="Reading before (Hobbs/Tach)">
        <Input type="number" step="0.1" value={form.reading_before}
          onChange={(e) => set("reading_before", e.target.value)}
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
      </Field>
      <Field label="Reading after">
        <Input type="number" step="0.1" value={form.reading_after}
          onChange={(e) => set("reading_after", e.target.value)}
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
      </Field>
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        className="hidden" onChange={handleScan} />
      <button type="button" disabled={scanning} onClick={() => fileRef.current?.click()}
        className="w-full rounded-xl border border-dashed border-cockpit-border bg-cockpit-panel py-3 flex items-center justify-center gap-2 text-cockpit-muted text-sm disabled:opacity-50">
        {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
        {scanning ? "Reading meter…" : "Scan Hobbs with camera"}
      </button>
      <div className="rounded-xl bg-cockpit-amber/5 border border-cockpit-amber/20 p-4 text-center">
        <p className="text-xs text-cockpit-muted uppercase tracking-wider mb-1">Flight time</p>
        <p className="font-mono text-3xl font-bold text-cockpit-amber">
          {mannedFlightTime > 0 ? mannedFlightTime.toFixed(1) : "0.0"}
        </p>
        {mannedFlightTime <= 0 && (
          <p className="text-[11px] text-cockpit-expired mt-1">Reading after must be greater than before</p>
        )}
      </div>
    </div>
  );

  /* ----- STEP 3: Route + touch-and-go (manned) ----- */
  const Step3 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="From">
          <Input value={form.from_aerodrome} onChange={(e) => set("from_aerodrome", e.target.value)}
            placeholder="FAOR"
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <Field label="To">
          <Input value={form.to_aerodrome} onChange={(e) => set("to_aerodrome", e.target.value)}
            placeholder="FAGG"
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-cockpit-muted uppercase tracking-wider">Intermediate stops</Label>
          <button type="button" onClick={addStop}
            className="text-xs text-cockpit-amber flex items-center gap-0.5">
            <Plus className="w-3 h-3" /> Add stop
          </button>
        </div>
        {form.stops.map((s, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <Input value={s.name} onChange={(e) => updateStop(i, "name", e.target.value)}
              placeholder={`Stop ${i + 1}`}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono flex-1" />
            <div className="shrink-0">
              <Stepper value={Number(s.tg) || 0} onChange={(v) => updateStop(i, "tg", v)} />
            </div>
            {form.stops.length > 1 && (
              <button type="button" onClick={() => removeStop(i)}
                className="text-cockpit-expired shrink-0 p-1">
                <Minus className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-cockpit-panel border border-cockpit-border p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-cockpit-muted uppercase tracking-wider">Touch &amp; go</span>
          <span className="font-mono text-sm font-bold text-cockpit-cream">{touchAndGo}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-cockpit-muted uppercase tracking-wider">Takeoffs</span>
          <span className="font-mono text-sm font-bold text-cockpit-cream">{takeoffs}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-cockpit-muted uppercase tracking-wider">Landings</span>
          <span className="font-mono text-sm font-bold text-cockpit-cream">{landings}</span>
        </div>
        <label className="flex items-center gap-2 pt-2 cursor-pointer">
          <input type="checkbox" checked={form.manualCounts}
            onChange={(e) => {
              const manual = e.target.checked;
              setForm((f) => ({
                ...f,
                manualCounts: manual,
                takeoffs: manual ? takeoffs : autoTakeoffs,
                landings: manual ? landings : autoLandings,
              }));
            }}
            className="accent-cockpit-amber" />
          <span className="text-xs text-cockpit-muted">Override manually</span>
        </label>
        {form.manualCounts && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Field label="Takeoffs">
              <Input type="number" value={form.takeoffs}
                onChange={(e) => set("takeoffs", e.target.value)}
                className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
            </Field>
            <Field label="Landings">
              <Input type="number" value={form.landings}
                onChange={(e) => set("landings", e.target.value)}
                className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
            </Field>
          </div>
        )}
      </div>
    </div>
  );

  /* ----- STEP 4: Role & conditions ----- */
  const Step4 = (
    <div className="space-y-4">
      <Field label="Pilot role">
        <Select value={form.pilot_role} onValueChange={(v) => set("pilot_role", v)}>
          <SelectTrigger className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["PIC", "Dual", "PICUS", "Co-pilot"].map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label={`${form.pilot_role} time (hrs)`} hint="Defaults to flight time — edit if needed.">
        <Input type="number" step="0.1" value={flightTime}
          onChange={(e) => set(ROLE_TIME_FIELD[form.pilot_role], e.target.value)}
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-amber font-mono" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Night time">
          <Input type="number" step="0.1" value={form.night_time}
            onChange={(e) => set("night_time", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <Field label="XC time">
          <Input type="number" step="0.1" value={form.xc_time}
            onChange={(e) => set("xc_time", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <Field label="Night landings">
          <Input type="number" value={form.night_landings}
            onChange={(e) => set("night_landings", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <Field label="Night takeoffs">
          <Input type="number" value={form.night_takeoffs}
            onChange={(e) => set("night_takeoffs", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <Field label="Instrument actual">
          <Input type="number" step="0.1" value={form.instrument_actual}
            onChange={(e) => set("instrument_actual", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <Field label="Instrument sim">
          <Input type="number" step="0.1" value={form.instrument_sim}
            onChange={(e) => set("instrument_sim", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
        <Field label="Sim time">
          <Input type="number" step="0.1" value={form.sim_time}
            onChange={(e) => set("sim_time", e.target.value)}
            className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
        </Field>
      </div>
      {isHeli && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Autorotations">
            <Input type="number" value={form.autorotations}
              onChange={(e) => set("autorotations", e.target.value)}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </Field>
          <Field label="Hoist cycles">
            <Input type="number" value={form.hoist_cycles}
              onChange={(e) => set("hoist_cycles", e.target.value)}
              className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream font-mono" />
          </Field>
        </div>
      )}
      <Field label="Remarks">
        <Textarea value={form.remarks} onChange={(e) => set("remarks", e.target.value)} rows={2}
          className="bg-cockpit-panel-light border-cockpit-border text-cockpit-cream resize-none" />
      </Field>
    </div>
  );

  /* ----- STEP 5: Review ----- */
  const Step5 = (
    <div className="space-y-3">
      <div className="rounded-xl bg-cockpit-panel border border-cockpit-border p-4 space-y-2">
        <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Aircraft</span><span className="text-sm text-cockpit-cream font-mono">{aircraft?.registration}</span></div>
        <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Mode</span><span className="text-sm text-cockpit-cream">{isRpas ? "RPAS" : "Manned"}</span></div>
        <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Date</span><span className="text-sm text-cockpit-cream font-mono">{isEdit ? (originalFlight?.date || todayStr()) : todayStr()}</span></div>
        <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Flight time</span><span className="text-sm text-cockpit-amber font-mono font-bold">{flightTime.toFixed(1)} hrs</span></div>
        {!isRpas && (
          <>
            <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Route</span><span className="text-sm text-cockpit-cream font-mono">{form.from_aerodrome}–{form.to_aerodrome}</span></div>
            <div className="flex justify-between"><span className="text-xs text-cockpit-muted">T&G / T-O / LDG</span><span className="text-sm text-cockpit-cream font-mono">{touchAndGo} / {takeoffs} / {landings}</span></div>
          </>
        )}
        {isRpas && (
          <>
            <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Site</span><span className="text-sm text-cockpit-cream font-mono">{form.launch_site}–{form.recovery_site}</span></div>
            {form.mission_type && <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Mission</span><span className="text-sm text-cockpit-cream">{form.mission_type}</span></div>}
            {form.operation_category && <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Operation</span><span className="text-sm text-cockpit-cream">{form.operation_category}</span></div>}
          </>
        )}
        <div className="flex justify-between"><span className="text-xs text-cockpit-muted">Role</span><span className="text-sm text-cockpit-cream">{form.pilot_role}</span></div>
      </div>
      <div className="rounded-xl bg-cockpit-valid/5 border border-cockpit-valid/20 p-3 flex items-center gap-2">
        <Shield className="w-4 h-4 text-cockpit-valid shrink-0" />
        <p className="text-xs text-cockpit-muted">Totals for pilot and aircraft will be updated on save.</p>
      </div>
    </div>
  );

  const stepContent = { 1: Step1, 2: Step2, 3: Step3, 4: Step4, 5: Step5 }[step];

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-5">
        {isEdit ? <Pencil className="w-5 h-5 text-cockpit-amber" /> : <Plus className="w-5 h-5 text-cockpit-amber" />}
        <h1 className="text-xl font-bold text-cockpit-cream">{isEdit ? "Edit Flight" : "Add Flight"}</h1>
      </div>

      <StepDots step={step} isRpas={isRpas} />

      {isEdit && !originalFlight ? <SkeletonCard lines={4} /> : stepContent}

      {error && (
        <div className="mt-4 rounded-xl bg-cockpit-expired/10 border border-cockpit-expired/30 p-3">
          <p className="text-xs text-cockpit-expired">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} disabled={saving}
            className="border-cockpit-border text-cockpit-muted hover:text-cockpit-cream">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        )}
        <div className="flex-1" />
        {step < 5 ? (
          <Button onClick={nextStep} disabled={!canContinue()}
            className="bg-cockpit-amber text-cockpit-bg hover:bg-cockpit-amber-hi">
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saving || pilotLoading}
            className="bg-cockpit-valid text-cockpit-bg hover:bg-cockpit-valid/90">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "Saving…" : isEdit ? "Save changes" : "Save flight"}
          </Button>
        )}
      </div>
    </div>
  );
}