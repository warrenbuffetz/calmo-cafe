import "server-only";

import type { CreateReservationInput } from "@/lib/reservations/schema";
import type { Reservation, ReservationStatus } from "@/lib/reservations/types";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
  status?: ReservationStatus;
}): Promise<Reservation[]> {
  let query = supabaseAdmin.from("reservations").select().order("reservation_time", {
    ascending: true,
  });

  if (filters.date) {
    query = query.eq("reservation_date", filters.date);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(normalizeReservation);
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation> {
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

  return normalizeReservation(data);
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
