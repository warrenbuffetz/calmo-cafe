import { NextResponse } from "next/server";
import { createReservationSchema } from "@/lib/reservations/schema";
import { createReservation } from "@/lib/reservations/queries";
import {
  isDateInBookingWindow,
  isValidTimeForDate,
} from "@/lib/reservations/time-slots";
import { sendReservationRequestEmails } from "@/lib/email/send";

export async function POST(request: Request) {
  try {
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

    const reservation = await createReservation(input);
    await sendReservationRequestEmails(reservation);

    return NextResponse.json({ id: reservation.id }, { status: 201 });
  } catch (error) {
    console.error("[reservations] POST failed:", error);
    return NextResponse.json(
      { error: "Unable to save your request right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
