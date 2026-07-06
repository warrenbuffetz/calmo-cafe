import { NextResponse } from "next/server";
import {
  actionToStatus,
  canTransitionTo,
  updateReservationStatus,
} from "@/lib/reservations/queries";
import { adminActionSchema } from "@/lib/reservations/schema";
import { isAdminAuthenticatedFromRequest } from "@/lib/auth/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ReservationStatus } from "@/lib/reservations/types";
import {
  sendReservationCancelledByRestaurantEmail,
  sendReservationConfirmedEmail,
} from "@/lib/email/send";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = adminActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("reservations")
      .select("status")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (!existing) {
      return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
    }

    const currentStatus = existing.status as ReservationStatus;

    if (!canTransitionTo(currentStatus, parsed.data.action)) {
      return NextResponse.json(
        { error: `Cannot ${parsed.data.action} a reservation with status "${currentStatus}".` },
        { status: 400 },
      );
    }

    const newStatus = actionToStatus(parsed.data.action);
    const reservation = await updateReservationStatus(id, newStatus, {
      action: parsed.data.action,
      actorId: "shared_pin",
    });

    try {
      if (parsed.data.action === "confirm") {
        await sendReservationConfirmedEmail(reservation);
      } else if (parsed.data.action === "cancel") {
        await sendReservationCancelledByRestaurantEmail(reservation);
      }
    } catch (emailError) {
      console.error("[admin/reservations] Email failed:", emailError);
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("[admin/reservations] PATCH failed:", error);
    return NextResponse.json({ error: "Unable to update reservation." }, { status: 500 });
  }
}
