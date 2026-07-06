import { NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/auth/admin";
import { getReservationCounts, listReservations } from "@/lib/reservations/queries";
import type { AdminListStatus, AdminStatusTab } from "@/lib/reservations/types";

const VALID_STATUS_TABS: AdminStatusTab[] = [
  "pending",
  "confirmed",
  "cancelled",
  "past",
  "all",
];

const VALID_LIST_STATUSES: AdminListStatus[] = [...VALID_STATUS_TABS, "active"];

export async function GET(request: Request) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const statusParam = searchParams.get("status");
    const q = searchParams.get("q") ?? undefined;
    const sortParam = searchParams.get("sort");

    const status: AdminListStatus =
      statusParam && VALID_LIST_STATUSES.includes(statusParam as AdminListStatus)
        ? (statusParam as AdminListStatus)
        : "pending";

    const sort = sortParam === "recent" ? "recent" : "upcoming";

    const [reservations, counts] = await Promise.all([
      listReservations({
        date: dateParam || undefined,
        from: fromParam || undefined,
        to: toParam || undefined,
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
