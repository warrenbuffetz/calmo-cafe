import "server-only";

import type { Reservation } from "@/lib/reservations/types";
import {
  cancelledByCustomerStaffEmail,
  cancelledByRestaurantEmail,
  confirmedCustomerEmail,
  requestReceivedCustomerEmail,
  requestReceivedStaffEmail,
} from "@/lib/email/templates";
import { getFromEmail, getResendClient, getStaffEmail } from "@/lib/email/resend";

async function sendEmail(to: string, subject: string, html: string) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured — skipping email to", to);
    return;
  }

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[email] Failed to send:", error);
  }
}

export async function sendReservationRequestEmails(reservation: Reservation) {
  const customer = requestReceivedCustomerEmail(reservation);
  const staff = requestReceivedStaffEmail(reservation);

  await Promise.all([
    sendEmail(reservation.customer_email, customer.subject, customer.html),
    sendEmail(getStaffEmail(), staff.subject, staff.html),
  ]);
}

export async function sendReservationConfirmedEmail(reservation: Reservation) {
  const email = confirmedCustomerEmail(reservation);
  await sendEmail(reservation.customer_email, email.subject, email.html);
}

export async function sendReservationCancelledByRestaurantEmail(reservation: Reservation) {
  const email = cancelledByRestaurantEmail(reservation);
  await sendEmail(reservation.customer_email, email.subject, email.html);
}

export async function sendReservationCancelledByCustomerStaffEmail(reservation: Reservation) {
  const email = cancelledByCustomerStaffEmail(reservation);
  await sendEmail(getStaffEmail(), email.subject, email.html);
}
