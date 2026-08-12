// Adds (sign=+1) or reverses (sign=-1) a flight's contribution to a pilot and aircraft.
// Returns the patch objects to save; caller persists them.
export function computeTotals(flight, pilot, aircraft, sign = 1) {
  const r1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
  const p = { ...pilot };
  const a = { ...aircraft };
  const f = flight;
  if (f.is_rpas) {
    p.rpas_total_time = r1((p.rpas_total_time || 0) + sign * (f.flight_time || 0));
    p.rpas_launches   = (p.rpas_launches || 0) + sign * (f.takeoffs || 0);
    p.rpas_landings   = (p.rpas_landings || 0) + sign * (f.landings || 0);
    p.rpas_night_time = r1((p.rpas_night_time || 0) + sign * (f.night_time || 0));
  } else {
    p.total_time       = r1((p.total_time || 0) + sign * (f.flight_time || 0));
    p.total_landings   = (p.total_landings || 0) + sign * (f.landings || 0);
    p.total_takeoffs   = (p.total_takeoffs || 0) + sign * (f.takeoffs || 0);
    p.total_night      = r1((p.total_night || 0) + sign * (f.night_time || 0));
    p.total_xc         = r1((p.total_xc || 0) + sign * (f.xc_time || 0));
    p.total_instrument = r1((p.total_instrument || 0) + sign * ((f.instrument_actual||0)+(f.instrument_sim||0)));
    p.total_pic        = r1((p.total_pic || 0) + sign * (f.pic_time || 0));
    p.total_dual       = r1((p.total_dual || 0) + sign * (f.dual_time || 0));
    p.total_picus      = r1((p.total_picus || 0) + sign * (f.picus_time || 0));
    p.total_co_pilot   = r1((p.total_co_pilot || 0) + sign * (f.co_pilot_time || 0));
  }
  if (aircraft) {
    a.total_time = r1((a.total_time || 0) + sign * (f.flight_time || 0));
    a.pic_time   = r1((a.pic_time || 0) + sign * (f.pic_time || 0));
    a.dual_time  = r1((a.dual_time || 0) + sign * (f.dual_time || 0));
    if (sign > 0) {
      a.last_flown = f.date;
      a.current_reading = a.time_source === 'Manual'
        ? r1((a.current_reading || 0) + (f.flight_time || 0))
        : (f.reading_after ?? a.current_reading);
    }
  }
  return { pilotPatch: p, aircraftPatch: a };
}

// Rebuilds all pilot aggregate totals from scratch by summing a list of flights.
// Mirrors computeTotals' field mapping. Use to repair drifted totals.
export function recalcPilotTotals(flights) {
  const r1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
  const p = {
    total_time: 0, total_landings: 0, total_takeoffs: 0, total_night: 0, total_xc: 0,
    total_instrument: 0, total_pic: 0, total_dual: 0, total_picus: 0, total_co_pilot: 0,
    rpas_total_time: 0, rpas_launches: 0, rpas_landings: 0, rpas_night_time: 0,
  };
  for (const f of flights || []) {
    if (f.is_rpas) {
      p.rpas_total_time += (f.flight_time || 0);
      p.rpas_launches += (f.takeoffs || 0);
      p.rpas_landings += (f.landings || 0);
      p.rpas_night_time += (f.night_time || 0);
    } else {
      p.total_time += (f.flight_time || 0);
      p.total_landings += (f.landings || 0);
      p.total_takeoffs += (f.takeoffs || 0);
      p.total_night += (f.night_time || 0);
      p.total_xc += (f.xc_time || 0);
      p.total_instrument += ((f.instrument_actual || 0) + (f.instrument_sim || 0));
      p.total_pic += (f.pic_time || 0);
      p.total_dual += (f.dual_time || 0);
      p.total_picus += (f.picus_time || 0);
      p.total_co_pilot += (f.co_pilot_time || 0);
    }
  }
  ["total_time", "total_night", "total_xc", "total_instrument", "total_pic", "total_dual", "total_picus", "total_co_pilot", "rpas_total_time", "rpas_night_time"].forEach((k) => { p[k] = r1(p[k]); });
  return p;
}