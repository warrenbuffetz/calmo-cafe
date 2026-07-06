import type { Reservation } from "@/lib/reservations/types";
import {
  formatReservationDate,
  formatReservationTime,
} from "@/lib/reservations/time-slots";
import { getAppBaseUrl } from "@/lib/email/resend";

const brand = {
  beige: "#F3EED7",
  brown: "#321B0F",
  blue: "#A2B9DB",
  redBrown: "#923F24",
};

function layout(content: string): string {
  return `
    <div style="font-family: Georgia, serif; background:${brand.beige}; color:${brand.brown}; padding:32px;">
      <div style="max-width:520px; margin:0 auto; background:#fff; border-radius:16px; padding:32px; border:1px solid rgba(50,27,15,0.1);">
        ${content}
        <p style="margin-top:32px; font-size:13px; color:rgba(50,27,15,0.55);">Calmo · 1227 Dundas St W, Toronto</p>
      </div>
    </div>
  `;
}

function reservationDetails(reservation: Reservation): string {
  return `
    <p style="margin:0 0 8px;"><strong>Date:</strong> ${formatReservationDate(reservation.reservation_date)}</p>
    <p style="margin:0 0 8px;"><strong>Time:</strong> ${formatReservationTime(reservation.reservation_time)}</p>
    <p style="margin:0 0 8px;"><strong>Party size:</strong> ${reservation.party_size}</p>
    <p style="margin:0 0 8px;"><strong>Name:</strong> ${reservation.customer_name}</p>
    ${reservation.notes ? `<p style="margin:0 0 8px;"><strong>Notes:</strong> ${reservation.notes}</p>` : ""}
  `;
}

export function requestReceivedCustomerEmail(reservation: Reservation) {
  return {
    subject: "We received your table request — Calmo",
    html: layout(`
      <h1 style="font-size:24px; margin:0 0 16px; color:${brand.brown};">Request received</h1>
      <p style="line-height:1.6;">Hi ${reservation.customer_name},</p>
      <p style="line-height:1.6;">Thanks for requesting a table at Calmo. We'll review your booking and confirm shortly.</p>
      ${reservationDetails(reservation)}
      <p style="line-height:1.6; margin-top:24px;">We'll email you once your reservation is confirmed.</p>
    `),
  };
}

export function requestReceivedStaffEmail(reservation: Reservation) {
  const baseUrl = getAppBaseUrl();
  return {
    subject: `New pending reservation — ${reservation.customer_name}`,
    html: layout(`
      <h1 style="font-size:24px; margin:0 0 16px; color:${brand.brown};">New pending request</h1>
      ${reservationDetails(reservation)}
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${reservation.customer_email}</p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${reservation.customer_phone}</p>
      <p style="margin-top:24px;">
        <a href="${baseUrl}/reservations/admin" style="display:inline-block; background:${brand.brown}; color:${brand.beige}; padding:12px 20px; border-radius:999px; text-decoration:none; font-size:14px;">Review in admin</a>
      </p>
    `),
  };
}

export function confirmedCustomerEmail(reservation: Reservation) {
  const cancelUrl = `${getAppBaseUrl()}/reservations/cancel/${reservation.cancellation_token}`;
  return {
    subject: "Your table is confirmed — Calmo",
    html: layout(`
      <h1 style="font-size:24px; margin:0 0 16px; color:${brand.brown};">You're confirmed</h1>
      <p style="line-height:1.6;">Hi ${reservation.customer_name},</p>
      <p style="line-height:1.6;">Your table at Calmo is confirmed. We look forward to seeing you.</p>
      ${reservationDetails(reservation)}
      <p style="line-height:1.6; margin-top:24px;">Need to cancel? Use the link in this email.</p>
      <p style="margin-top:16px;">
        <a href="${cancelUrl}" style="color:${brand.redBrown};">Cancel reservation</a>
      </p>
    `),
  };
}

export function cancelledByRestaurantEmail(reservation: Reservation) {
  return {
    subject: "Reservation update — Calmo",
    html: layout(`
      <h1 style="font-size:24px; margin:0 0 16px; color:${brand.brown};">Reservation cancelled</h1>
      <p style="line-height:1.6;">Hi ${reservation.customer_name},</p>
      <p style="line-height:1.6;">We're sorry — we had to cancel your reservation. Please reach out or visit us walk-in when you can.</p>
      ${reservationDetails(reservation)}
    `),
  };
}

export function cancelledByCustomerStaffEmail(reservation: Reservation) {
  return {
    subject: `Guest cancelled — ${reservation.customer_name}`,
    html: layout(`
      <h1 style="font-size:24px; margin:0 0 16px; color:${brand.brown};">Guest cancelled</h1>
      <p style="line-height:1.6;">A guest cancelled their reservation.</p>
      ${reservationDetails(reservation)}
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${reservation.customer_email}</p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${reservation.customer_phone}</p>
    `),
  };
}
