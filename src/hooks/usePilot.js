import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

export default function usePilot() {
  const [pilot, setPilot] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPilot = useCallback(async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const pilots = await base44.entities.Pilot.filter({ created_by_id: user.id }, "-created_date", 1);
      if (pilots.length > 0) {
        setPilot(pilots[0]);
      } else {
        const newPilot = await base44.entities.Pilot.create({
          full_name: user.full_name || "Pilot",
          onboarded: false,
          total_time: 0,
          total_pic: 0,
          total_dual: 0,
          total_xc: 0,
          total_night: 0,
          total_instrument: 0,
          total_landings: 0,
        });
        setPilot(newPilot);
      }
    } catch (e) {
      console.error("Failed to load pilot", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPilot(); }, [loadPilot]);

  return { pilot, loading, reload: loadPilot };
}