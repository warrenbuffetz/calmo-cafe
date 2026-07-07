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

/** Never throws — reservation/cancel flows must succeed even when email is down. */
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured — skipping email to", to);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: getFromEmail(),
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Failed to send to", to, error);
    }
  } catch (error) {
    console.error("[email] Unexpected send failure to", to, error);
  }
}

async function sendEmails(
  messages: Array<{ to: string; subject: string; html: string }>,
): Promise<void> {
  await Promise.allSettled(
    messages.map((message) => sendEmail(message.to, message.subject, message.html)),
  );
}

export async function sendReservationRequestEmails(reservation: Reservation): Promise<void> {
  const customer = requestReceivedCustomerEmail(reservation);
  const staff = requestReceivedStaffEmail(reservation);

  await sendEmails([
    {
      to: reservation.customer_email,
      subject: customer.subject,
      html: customer.html,
    },
    {
      to: getStaffEmail(),
      subject: staff.subject,
      html: staff.html,
    },
  ]);
}

export async function sendReservationConfirmedEmail(reservation: Reservation): Promise<void> {
  const email = confirmedCustomerEmail(reservation);
  await sendEmail(reservation.customer_email, email.subject, email.html);
}

export async function sendReservationCancelledByRestaurantEmail(
  reservation: Reservation,
): Promise<void> {
  const email = cancelledByRestaurantEmail(reservation);
  await sendEmail(reservation.customer_email, email.subject, email.html);
}

export async function sendReservationCancelledByCustomerStaffEmail(
  reservation: Reservation,
): Promise<void> {
  const email = cancelledByCustomerStaffEmail(reservation);
  await sendEmail(getStaffEmail(), email.subject, email.html);
}
