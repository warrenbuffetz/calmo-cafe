import "server-only";

import type { Reservation } from "@/lib/reservations/types";
import { getAppBaseUrl } from "@/lib/email/resend";
import { isMenuEnabled } from "@/lib/features";
import { venue } from "@/lib/venue";

export function getManageUrl(reservation: Reservation): string {
  return `${getAppBaseUrl()}/reservations/manage/${reservation.cancellation_token}`;
}

export function getModifyUrl(reservation: Reservation): string {
  return `${getAppBaseUrl()}/reservations/manage/${reservation.cancellation_token}/modify`;
}

export function getCancelUrl(reservation: Reservation): string {
  return `${getAppBaseUrl()}/reservations/cancel/${reservation.cancellation_token}`;
}

export function getCalendarUrl(reservation: Reservation): string {
  return `${getAppBaseUrl()}/api/reservations/calendar/${reservation.cancellation_token}`;
}

export function getMenuUrl(): string {
  return `${getAppBaseUrl()}${isMenuEnabled() ? "/#menu" : "/#gallery"}`;
}

export function getDirectionsUrl(): string {
  return venue.address.mapsUrl;
}

export function getLogoUrl(): string {
  return `${getAppBaseUrl()}/logo-brown.png`;
}

export function getFooterMapUrl(): string {
  return `${getAppBaseUrl()}/footer-map.png`;
}
