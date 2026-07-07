import { NextResponse, after } from "next/server";
import { createReservationSchema } from "@/lib/reservations/schema";
import { modifyReservationByToken } from "@/lib/reservations/queries";
import {
  isDateInBookingWindow,
  isValidTimeForDate,
} from "@/lib/reservations/time-slots";
import { sendReservationRequestEmails } from "@/lib/email/send";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    const body = await request.json();
    const parsed = createReservationSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      return NextResponse.json(
        { error: "Please check the form and try again.", fieldErrors },
        { status: 400 },
      );
    }

    const input = parsed.data;

    if (!isDateInBookingWindow(input.reservation_date)) {
      return NextResponse.json(
        {
          error: "Please choose a date within the next 30 days.",
          fieldErrors: { reservation_date: "Date is outside the booking window." },
        },
        { status: 400 },
      );
    }

    if (!isValidTimeForDate(input.reservation_date, input.reservation_time)) {
      return NextResponse.json(
        {
          error: "Please choose a valid time for the selected date.",
          fieldErrors: { reservation_time: "Time is not available." },
        },
        { status: 400 },
      );
    }

    const { reservation } = await modifyReservationByToken(token, input);

    after(async () => {
      await sendReservationRequestEmails(reservation);
    });

    return NextResponse.json(
      { id: reservation.id, cancellation_token: reservation.cancellation_token },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to modify reservation.";
    const status = message.includes("not found") ? 404 : message.includes("no longer") ? 400 : 500;
    console.error("[reservations/modify] POST failed:", error);
    return NextResponse.json(
      { error: status === 500 ? "Unable to save your updated request right now." : message },
      { status },
    );
  }
}
