import "server-only";

import type { Reservation } from "@/lib/reservations/types";

const TORONTO_TZ = "America/Toronto";
const DEFAULT_DURATION_MINUTES = 90;

function torontoOffsetForDate(dateStr: string): string {
  const ref = new Date(`${dateStr}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO_TZ,
    timeZoneName: "longOffset",
  }).formatToParts(ref);
  const tzName = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT-5";
  const match = tzName.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return "-05:00";
  const sign = match[1];
  const hours = match[2].padStart(2, "0");
  const minutes = (match[3] ?? "00").padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}

export function getReservationStartIso(reservation: Reservation): string {
  const offset = torontoOffsetForDate(reservation.reservation_date);
  return `${reservation.reservation_date}T${reservation.reservation_time}:00${offset}`;
}

export function getReservationEndIso(reservation: Reservation): string {
  const [hours, minutes] = reservation.reservation_time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + DEFAULT_DURATION_MINUTES;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  const offset = torontoOffsetForDate(reservation.reservation_date);
  return `${reservation.reservation_date}T${endTime}:00${offset}`;
}

export function formatIcsDateTime(dateStr: string, timeStr: string): string {
  const compactDate = dateStr.replace(/-/g, "");
  const compactTime = timeStr.replace(/:/g, "") + "00";
  return `${compactDate}T${compactTime}`;
}

export function getDefaultDurationMinutes(): number {
  return DEFAULT_DURATION_MINUTES;
}
