import "server-only";

import type { Reservation } from "@/lib/reservations/types";
import {
  cancelledByCustomerStaffEmail,
  cancelledByRestaurantEmail,
  confirmedCustomerEmail,
  requestReceivedCustomerEmail,
  requestReceivedStaffEmail,
} from "@/lib/email/templates";
import { buildReservationIcs, getIcsFilename } from "@/lib/email/calendar";
import { getFromEmail, getResendClient, getStaffEmail } from "@/lib/email/resend";

type EmailAttachment = {
  filename: string;
  content: Buffer;
  content_type?: string;
};

type SendEmailOptions = {
  attachments?: EmailAttachment[];
};

/** Never throws — reservation/cancel flows must succeed even when email is down. */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: SendEmailOptions,
): Promise<void> {
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
      attachments: options?.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        content_type: attachment.content_type,
      })),
    });

    if (error) {
      console.error("[email] Failed to send to", to, error);
    }
  } catch (error) {
    console.error("[email] Unexpected send failure to", to, error);
  }
}

async function sendEmails(
  messages: Array<{
    to: string;
    subject: string;
    html: string;
    attachments?: EmailAttachment[];
  }>,
): Promise<void> {
  await Promise.allSettled(
    messages.map((message) =>
      sendEmail(message.to, message.subject, message.html, {
        attachments: message.attachments,
      }),
    ),
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
  const icsContent = buildReservationIcs(reservation);

  await sendEmail(reservation.customer_email, email.subject, email.html, {
    attachments: [
      {
        filename: getIcsFilename(),
        content: Buffer.from(icsContent, "utf-8"),
        content_type: "text/calendar; charset=utf-8; method=PUBLISH",
      },
    ],
  });
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
