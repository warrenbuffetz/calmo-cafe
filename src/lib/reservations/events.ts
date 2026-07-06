import "server-only";

import type {
  ReservationActorType,
  ReservationEventAction,
  ReservationStatus,
} from "@/lib/reservations/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type LogReservationEventInput = {
  reservationId: string;
  action: ReservationEventAction;
  fromStatus: ReservationStatus | null;
  toStatus: ReservationStatus;
  actorType: ReservationActorType;
  actorId?: string | null;
};

export async function logReservationEvent(input: LogReservationEventInput): Promise<void> {
  const { error } = await supabaseAdmin.from("reservation_events").insert({
    reservation_id: input.reservationId,
    action: input.action,
    from_status: input.fromStatus,
    to_status: input.toStatus,
    actor_type: input.actorType,
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
