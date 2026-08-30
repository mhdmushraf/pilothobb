// Plan tiers and free-tier limits for PilotHobb.
export const FREE_LIMITS = { flights: 50, aircraft: 3, signatures: 5 };

// Prices (South African Rand).
export const PRICES = {
  annualZar: 499,
  monthlyZar: 59,
  annualLabel: "R499/yr",
  monthlyLabel: "R59/mo",
};

export const isFreePlan = (pilot) => !pilot || (pilot.plan || "free") === "free";
export const hasPaidPlan = (pilot) => !!pilot && (pilot.plan === "cpl" || pilot.plan === "school");

export const flightLimitReached = (pilot) =>
  isFreePlan(pilot) && (pilot?.flight_count || 0) >= FREE_LIMITS.flights;
export const aircraftLimitReached = (pilot) =>
  isFreePlan(pilot) && (pilot?.aircraft_count || 0) >= FREE_LIMITS.aircraft;
export const signatureLimitReached = (pilot) =>
  isFreePlan(pilot) && (pilot?.signature_count || 0) >= FREE_LIMITS.signatures;
