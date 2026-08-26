/**
 * Reservations stay off in production and preview until explicitly enabled.
 * Set FEATURE_RESERVATIONS=true in local .env.local while developing.
 */
export function isReservationsEnabled(): boolean {
  return process.env.FEATURE_RESERVATIONS === "true";
}
