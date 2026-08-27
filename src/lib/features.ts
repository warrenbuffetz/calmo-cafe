/**
 * Reservations stay off in production and preview until explicitly enabled.
 * Set FEATURE_RESERVATIONS=true in local .env.local while developing.
 */
export function isReservationsEnabled(): boolean {
  return process.env.FEATURE_RESERVATIONS === "true";
}

/**
 * Menu section on the homepage. Set NEXT_PUBLIC_FEATURE_MENU=false in .env.local
 * to hide temporarily while reviewing the page without it.
 */
export function isMenuEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FEATURE_MENU !== "false";
}
