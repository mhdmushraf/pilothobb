// Plan tiers and free-tier limits for PilotHobb.
export const FREE_LIMITS = { flights: 50, aircraft: 3, signatures: 5 };

// Card charges run through Tap in USD (Tap does not support ZAR). ZAR values are
// kept as the reference price shown to South African customers ("≈ R499").
export const PRICES = {
  annualUsd: 27,
  monthlyUsd: 3.2,
  annualLabel: "$27/yr",
  monthlyLabel: "$3.20/mo",
  annualZarRef: 499,
  monthlyZarRef: 59,
};

export const isFreePlan = (pilot) => !pilot || (pilot.plan || "free") === "free";
export const hasPaidPlan = (pilot) => !!pilot && (pilot.plan === "cpl" || pilot.plan === "school");

export const flightLimitReached = (pilot) =>
  isFreePlan(pilot) && (pilot?.flight_count || 0) >= FREE_LIMITS.flights;
export const aircraftLimitReached = (pilot) =>
  isFreePlan(pilot) && (pilot?.aircraft_count || 0) >= FREE_LIMITS.aircraft;
export const signatureLimitReached = (pilot) =>
  isFreePlan(pilot) && (pilot?.signature_count || 0) >= FREE_LIMITS.signatures;
