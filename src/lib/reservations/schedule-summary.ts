import type { Reservation } from "@/lib/reservations/types";

export type ScheduleSummary = {
  confirmed: number;
  pending: number;
  guests: number;
};

export type ScheduleSummaryPart = {
  text: string;
  variant?: "default" | "pending";
};

export function getScheduleSummary(reservations: Reservation[]): ScheduleSummary {
  let confirmed = 0;
  let pending = 0;
  let guests = 0;

  for (const reservation of reservations) {
    guests += reservation.party_size;
    if (reservation.status === "confirmed") {
      confirmed += 1;
    } else if (reservation.status === "pending") {
      pending += 1;
    }
  }

  return { confirmed, pending, guests };
}

export function getScheduleSummaryParts(summary: ScheduleSummary): ScheduleSummaryPart[] {
  const { confirmed, pending, guests } = summary;
  const total = confirmed + pending;

  if (total === 0) {
    return [{ text: "No reservations" }];
  }

  const parts: ScheduleSummaryPart[] = [];

  if (confirmed > 0) {
    parts.push({
      text: `${confirmed} confirmed`,
      variant: "default",
    });
  }

  if (pending > 0) {
    parts.push({
      text: `${pending} pending`,
      variant: "pending",
    });
  }

  if (guests > 0) {
    parts.push({
      text: `${guests} guest${guests === 1 ? "" : "s"}`,
      variant: "default",
    });
  }

  return parts;
}

export function formatScheduleSummaryLine(summary: ScheduleSummary): string {
  return getScheduleSummaryParts(summary)
    .map((part) => part.text)
    .join(" · ");
}
