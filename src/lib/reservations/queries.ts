import "server-only";

import type { CreateReservationInput } from "@/lib/reservations/schema";
import type {
  AdminListStatus,
  Reservation,
  ReservationCounts,
  ReservationStatus,
} from "@/lib/reservations/types";
import { ACTIVE_STATUSES } from "@/lib/reservations/types";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logReservationEvent } from "@/lib/reservations/events";
import type { StaffReservationEventAction } from "@/lib/reservations/types";

export async function createReservation(
  input: CreateReservationInput,
): Promise<Reservation> {
  const { data, error } = await supabaseAdmin
    .from("reservations")
    .insert({
      customer_name: input.customer_name,
      customer_email: input.customer_email.toLowerCase(),
      customer_phone: input.customer_phone,
      party_size: input.party_size,
      reservation_date: input.reservation_date,
      reservation_time: `${input.reservation_time}:00`,
      notes: input.notes?.trim() || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeReservation(data);
}

export async function getReservationByToken(token: string): Promise<Reservation | null> {
  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select()
    .eq("cancellation_token", token)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? normalizeReservation(data) : null;
}

export async function listReservations(filters: {
  date?: string;
  from?: string;
  to?: string;
  status?: AdminListStatus;
  q?: string;
  sort?: "upcoming" | "recent";
}): Promise<Reservation[]> {
  const ascending = filters.sort !== "recent";

  let query = supabaseAdmin
    .from("reservations")
    .select()
    .order("reservation_date", { ascending })
    .order("reservation_time", { ascending })
    .limit(100);

  if (filters.date) {
    query = query.eq("reservation_date", filters.date);
  } else {
    if (filters.from) {
      query = query.gte("reservation_date", filters.from);
    }
    if (filters.to) {
      query = query.lte("reservation_date", filters.to);
    }
  }

  if (filters.status && filters.status !== "all") {
    if (filters.status === "active") {
      query = query.in("status", ACTIVE_STATUSES);
    } else if (filters.status === "cancelled") {
      query = query.in("status", ["cancelled_by_customer", "cancelled_by_restaurant"]);
    } else if (filters.status === "past") {
      query = query.in("status", ["completed", "no_show"]);
    } else {
      query = query.eq("status", filters.status);
    }
  }

  const search = filters.q?.trim();
  if (search) {
    const escaped = search.replace(/[%_]/g, "");
    const pattern = `%${escaped}%`;
    query = query.or(
      `customer_name.ilike.${pattern},customer_email.ilike.${pattern},customer_phone.ilike.${pattern}`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizeReservation);
}

export async function getReservationCounts(): Promise<ReservationCounts> {
  const [pendingResult, confirmedResult] = await Promise.all([
    supabaseAdmin
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseAdmin
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed"),
  ]);

  if (pendingResult.error) {
    throw new Error(pendingResult.error.message);
  }
  if (confirmedResult.error) {
    throw new Error(confirmedResult.error.message);
  }

  return {
    pending: pendingResult.count ?? 0,
    confirmed: confirmedResult.count ?? 0,
  };
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  event?: {
    action: StaffReservationEventAction;
    actorId?: string | null;
  },
): Promise<Reservation> {
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("reservations")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!existing) {
    throw new Error("Reservation not found.");
  }

  const fromStatus = existing.status as ReservationStatus;
  const now = new Date().toISOString();

  const patch: Record<string, string> = { status };

  if (status === "confirmed") {
    patch.confirmed_at = now;
  }

  if (
    status === "cancelled_by_customer" ||
    status === "cancelled_by_restaurant"
  ) {
    patch.cancelled_at = now;
  }

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const reservation = normalizeReservation(data);

  if (event) {
    await logReservationEvent({
      reservationId: reservation.id,
      action: event.action,
      fromStatus,
      toStatus: status,
      actorId: event.actorId,
    });
  }

  return reservation;
}

function normalizeReservation(row: Record<string, unknown>): Reservation {
  const time = String(row.reservation_time ?? "");
  const reservationTime = time.length >= 5 ? time.slice(0, 5) : time;

  return {
    id: String(row.id),
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    customer_phone: String(row.customer_phone),
    party_size: Number(row.party_size),
    reservation_date: String(row.reservation_date),
    reservation_time: reservationTime,
    notes: row.notes ? String(row.notes) : null,
    status: row.status as ReservationStatus,
    cancellation_token: String(row.cancellation_token),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    confirmed_at: row.confirmed_at ? String(row.confirmed_at) : null,
    cancelled_at: row.cancelled_at ? String(row.cancelled_at) : null,
  };
}

export async function cancelReservationByToken(token: string): Promise<Reservation | null> {
  const reservation = await getReservationByToken(token);
  if (!reservation) return null;

  if (
    reservation.status === "cancelled_by_customer" ||
    reservation.status === "cancelled_by_restaurant"
  ) {
    return reservation;
  }

  if (reservation.status === "completed" || reservation.status === "no_show") {
    return reservation;
  }

  return updateReservationStatus(reservation.id, "cancelled_by_customer");
}

export function canTransitionTo(
  current: ReservationStatus,
  action: "confirm" | "cancel" | "complete" | "no_show",
): boolean {
  switch (action) {
    case "confirm":
      return current === "pending";
    case "cancel":
      return current === "pending" || current === "confirmed";
    case "complete":
      return current === "confirmed";
    case "no_show":
      return current === "confirmed";
    default:
      return false;
  }
}

export function actionToStatus(
  action: "confirm" | "cancel" | "complete" | "no_show",
): ReservationStatus {
  switch (action) {
    case "confirm":
      return "confirmed";
    case "cancel":
      return "cancelled_by_restaurant";
    case "complete":
      return "completed";
    case "no_show":
      return "no_show";
  }
}
