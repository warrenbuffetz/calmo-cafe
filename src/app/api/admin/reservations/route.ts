import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/auth/admin";
import { getReservationCounts, listReservations } from "@/lib/reservations/queries";
import type { AdminStatusTab } from "@/lib/reservations/types";

const VALID_STATUS_TABS: AdminStatusTab[] = [
  "pending",
  "confirmed",
  "cancelled",
  "past",
  "all",
];

export async function GET(request: Request) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const statusParam = searchParams.get("status");
    const q = searchParams.get("q") ?? undefined;
    const sortParam = searchParams.get("sort");

    const status: AdminStatusTab =
      statusParam && VALID_STATUS_TABS.includes(statusParam as AdminStatusTab)
        ? (statusParam as AdminStatusTab)
        : "pending";

    const sort = sortParam === "recent" ? "recent" : "upcoming";

    const [reservations, counts] = await Promise.all([
      listReservations({
        date: dateParam || undefined,
        status,
        q,
        sort: status === "past" ? "recent" : sort,
      }),
      getReservationCounts(),
    ]);

    return NextResponse.json({ reservations, counts });
  } catch (error) {
    console.error("[admin/reservations] GET failed:", error);
    return NextResponse.json({ error: "Unable to load reservations." }, { status: 500 });
  }
}
