import { NextResponse } from "next/server";
import { buildReservationIcs, getIcsFilename } from "@/lib/email/calendar";
import { getReservationByToken } from "@/lib/reservations/queries";
import { CANCELLED_STATUSES } from "@/lib/reservations/types";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    const reservation = await getReservationByToken(token);

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    if (CANCELLED_STATUSES.includes(reservation.status)) {
      return NextResponse.json(
        { error: "This reservation is no longer active." },
        { status: 400 },
      );
    }

    const ics = buildReservationIcs(reservation);

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${getIcsFilename()}"`,
      },
    });
  } catch (error) {
    console.error("[calendar] GET failed:", error);
    return NextResponse.json({ error: "Unable to generate calendar file." }, { status: 500 });
  }
}
