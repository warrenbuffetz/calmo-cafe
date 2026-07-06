import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/auth/admin";
import { listReservations } from "@/lib/reservations/queries";
import { RESERVATION_STATUSES } from "@/lib/reservations/types";
import { formatDateInput } from "@/lib/reservations/time-slots";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") ?? formatDateInput(new Date());
    const statusParam = searchParams.get("status");

    const status =
      statusParam && RESERVATION_STATUSES.includes(statusParam as (typeof RESERVATION_STATUSES)[number])
        ? (statusParam as (typeof RESERVATION_STATUSES)[number])
        : undefined;

    const reservations = await listReservations({ date, status });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("[admin/reservations] GET failed:", error);
    return NextResponse.json({ error: "Unable to load reservations." }, { status: 500 });
  }
}
