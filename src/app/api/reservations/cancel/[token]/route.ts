import { NextResponse } from "next/server";
import { cancelReservationByToken } from "@/lib/reservations/queries";
import { CANCELLED_STATUSES } from "@/lib/reservations/types";
import { sendReservationCancelledByCustomerStaffEmail } from "@/lib/email/send";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    const { getReservationByToken } = await import("@/lib/reservations/queries");
    const reservation = await getReservationByToken(token);

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("[cancel] GET failed:", error);
    return NextResponse.json({ error: "Unable to load reservation." }, { status: 500 });
  }
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    const { getReservationByToken } = await import("@/lib/reservations/queries");
    const existing = await getReservationByToken(token);

    if (!existing) {
      return NextResponse.json(
        { error: "This cancellation link is invalid or has expired." },
        { status: 404 },
      );
    }

    if (existing.status === "completed" || existing.status === "no_show") {
      return NextResponse.json(
        { error: "This reservation can no longer be cancelled." },
        { status: 400 },
      );
    }

    const wasAlreadyCancelled = CANCELLED_STATUSES.includes(existing.status);
    const reservation = await cancelReservationByToken(token);

    if (!reservation) {
      return NextResponse.json(
        { error: "This cancellation link is invalid or has expired." },
        { status: 404 },
      );
    }

    if (!wasAlreadyCancelled && reservation.status === "cancelled_by_customer") {
      try {
        await sendReservationCancelledByCustomerStaffEmail(reservation);
      } catch (emailError) {
        console.error("[cancel] Staff email failed:", emailError);
      }
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("[cancel] POST failed:", error);
    return NextResponse.json(
      { error: "Unable to cancel right now. Please try again." },
      { status: 500 },
    );
  }
}
