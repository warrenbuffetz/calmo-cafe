import "server-only";

import type { Reservation } from "@/lib/reservations/types";
import { venue } from "@/lib/venue";
import {
  formatIcsDateTime,
  getDefaultDurationMinutes,
} from "@/lib/email/datetime";
import { getManageUrl } from "@/lib/email/urls";
import {
  formatReservationDate,
  formatReservationTime,
} from "@/lib/reservations/time-slots";

function foldLine(line: string): string {
  return line.replace(/\r?\n/g, "\\n");
}

export function buildReservationIcs(reservation: Reservation): string {
  const start = formatIcsDateTime(reservation.reservation_date, reservation.reservation_time);
  const [hours, minutes] = reservation.reservation_time.split(":").map(Number);
  const endTotal = hours * 60 + minutes + getDefaultDurationMinutes();
  const endHours = String(Math.floor(endTotal / 60) % 24).padStart(2, "0");
  const endMinutes = String(endTotal % 60).padStart(2, "0");
  const end = formatIcsDateTime(reservation.reservation_date, `${endHours}:${endMinutes}`);

  const summary = foldLine(`Calmo — party of ${reservation.party_size}`);
  const description = foldLine(
    `Reservation for ${reservation.customer_name}. ${formatReservationDate(reservation.reservation_date)} at ${formatReservationTime(reservation.reservation_time)}. Manage: ${getManageUrl(reservation)}`,
  );
  const location = foldLine(`${venue.address.line1}, ${venue.address.line2}`);
  const uid = `${reservation.id}@calmo.ca`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Calmo Cafe//Reservations//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=America/Toronto:${start}`,
    `DTEND;TZID=America/Toronto:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `URL:${getManageUrl(reservation)}`,
    `STATUS:CONFIRMED`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Calmo reservation in 1 hour",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function getIcsFilename(): string {
  return "calmo-reservation.ics";
}
