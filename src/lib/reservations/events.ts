import "server-only";

import type {
  ReservationStatus,
  StaffReservationEventAction,
} from "@/lib/reservations/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type LogReservationEventInput = {
  reservationId: string;
  action: StaffReservationEventAction;
  fromStatus: ReservationStatus | null;
  toStatus: ReservationStatus;
  actorId?: string | null;
};

/** Staff-only audit log. Guest requests and cancellations live on reservations. */
export async function logReservationEvent(input: LogReservationEventInput): Promise<void> {
  const { error } = await supabaseAdmin.from("reservation_events").insert({
    reservation_id: input.reservationId,
    action: input.action,
    from_status: input.fromStatus,
    to_status: input.toStatus,
    actor_type: "staff",
    actor_id: input.actorId ?? null,
  });

  if (error) {
    console.error("[reservation_events] Failed to log event:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      input,
    });
  }
}
