import "server-only";

import type { Reservation } from "@/lib/reservations/types";
import {
  formatReservationDate,
  formatReservationTime,
} from "@/lib/reservations/time-slots";
import { emailBrand, emailFonts } from "@/lib/email/brand";
import { emailButton, emailDetailCard, emailLayout, escapeHtml } from "@/lib/email/layout";
import { buildReservationJsonLd } from "@/lib/email/schema";
import { getAppBaseUrl } from "@/lib/email/resend";
import {
  getCalendarUrl,
  getCancelUrl,
  getDirectionsUrl,
  getModifyUrl,
  getMenuUrl,
} from "@/lib/email/urls";

function reservationDetailRows(reservation: Reservation) {
  return [
    { label: "Date", value: formatReservationDate(reservation.reservation_date) },
    { label: "Time", value: formatReservationTime(reservation.reservation_time) },
    { label: "Party", value: `${reservation.party_size} guest${reservation.party_size === 1 ? "" : "s"}` },
    { label: "Name", value: reservation.customer_name },
    ...(reservation.notes ? [{ label: "Notes", value: reservation.notes }] : []),
  ];
}

function bodyCopy(text: string): string {
  return `<p style="margin:0 0 16px; font-family:${emailFonts.body}; font-size:15px; line-height:1.65; color:${emailBrand.muted};">${text}</p>`;
}

function headline(text: string): string {
  return `<h1 style="margin:0 0 8px; font-family:${emailFonts.title}; font-size:26px; font-weight:700; line-height:1.25; color:${emailBrand.brown};">${escapeHtml(text)}</h1>`;
}

function subhead(text: string): string {
  return `<p style="margin:0 0 24px; font-family:${emailFonts.accent}; font-size:15px; font-style:italic; line-height:1.5; color:rgba(50,27,15,0.55);">${escapeHtml(text)}</p>`;
}

export function requestReceivedCustomerEmail(reservation: Reservation) {
  const name = escapeHtml(reservation.customer_name);
  return {
    subject: "We've got your table request — Calmo",
    html: emailLayout({
      preheader: "We'll be in touch once your table is set.",
      content: `
        ${headline("We've got your request")}
        ${subhead("Simple food. Good coffee. No fuss.")}
        ${bodyCopy(`Hi ${name}, thanks for reaching out. We've received your reservation request and will confirm your table shortly.`)}
        ${emailDetailCard(reservationDetailRows(reservation))}
        ${bodyCopy("Walk-ins are always welcome too — we'll email you as soon as your booking is confirmed.")}
      `,
    }),
  };
}

export function requestReceivedStaffEmail(reservation: Reservation) {
  const baseUrl = getAppBaseUrl();
  return {
    subject: `New table request — ${reservation.customer_name}`,
    html: emailLayout({
      preheader: `Pending request from ${reservation.customer_name}`,
      content: `
        ${headline("New pending request")}
        ${bodyCopy("A guest just requested a table. Review and confirm when you're ready.")}
        ${emailDetailCard([
          ...reservationDetailRows(reservation),
          { label: "Email", value: reservation.customer_email },
          { label: "Phone", value: reservation.customer_phone },
        ])}
        <p style="margin-top:8px;">
          ${emailButton(`${baseUrl}/reservations/admin`, "Review in admin")}
        </p>
      `,
    }),
  };
}

export function confirmedCustomerEmail(reservation: Reservation) {
  const name = escapeHtml(reservation.customer_name);
  const manageUrl = getModifyUrl(reservation);
  const cancelUrl = getCancelUrl(reservation);
  const calendarUrl = getCalendarUrl(reservation);

  return {
    subject: "You're all set for brunch — Calmo",
    html: emailLayout({
      preheader: `Confirmed for ${formatReservationDate(reservation.reservation_date)} at ${formatReservationTime(reservation.reservation_time)}`,
      jsonLd: buildReservationJsonLd(reservation),
      content: `
        ${headline("You're all set")}
        ${subhead("Your table at Calmo is confirmed.")}
        ${bodyCopy(`Hi ${name}, we're looking forward to having you. Here are your details:`)}
        ${emailDetailCard(reservationDetailRows(reservation))}
        <p style="margin:0 0 12px; font-family:${emailFonts.body}; font-size:12px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${emailBrand.redBrown};">Your reservation</p>
        <p style="margin:0 0 20px;">
          ${emailButton(calendarUrl, "Add to calendar")}
          ${emailButton(manageUrl, "Modify")}
          ${emailButton(cancelUrl, "Cancel", "secondary")}
        </p>
        <p style="margin:0 0 20px;">
          ${emailButton(getMenuUrl(), "See menu", "secondary")}
          ${emailButton(getDirectionsUrl(), "Get directions", "secondary")}
        </p>
        ${bodyCopy("A few notes: walk-ins are always welcome, and we're a cozy neighborhood spot — no rush, no fuss. See you soon.")}
      `,
    }),
  };
}

export function cancelledByRestaurantEmail(reservation: Reservation) {
  const name = escapeHtml(reservation.customer_name);
  return {
    subject: "Update on your Calmo reservation",
    html: emailLayout({
      preheader: "We had to cancel your reservation.",
      content: `
        ${headline("Something came up on our end")}
        ${subhead("We're sorry we can't host you this time.")}
        ${bodyCopy(`Hi ${name}, we had to cancel your reservation. We know that's disappointing — please know we'd still love to see you walk in when you can.`)}
        ${emailDetailCard(reservationDetailRows(reservation))}
        ${bodyCopy(`Questions? Reply to this email or reach us at hello@calmo.ca.`)}
      `,
    }),
  };
}

export function cancelledByCustomerStaffEmail(reservation: Reservation) {
  return {
    subject: `Guest cancelled — ${reservation.customer_name}`,
    html: emailLayout({
      preheader: `${reservation.customer_name} cancelled their reservation.`,
      content: `
        ${headline("Guest cancelled")}
        ${bodyCopy("A guest cancelled their reservation using their manage link.")}
        ${emailDetailCard([
          ...reservationDetailRows(reservation),
          { label: "Email", value: reservation.customer_email },
          { label: "Phone", value: reservation.customer_phone },
        ])}
      `,
    }),
  };
}
