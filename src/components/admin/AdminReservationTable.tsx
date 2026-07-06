"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/FormField";
import {
  formatReservationDate,
  formatReservationTime,
  formatDateInput,
} from "@/lib/reservations/time-slots";
import {
  RESERVATION_STATUSES,
  STATUS_LABELS,
  type Reservation,
  type ReservationStatus,
} from "@/lib/reservations/types";
import { cn } from "@/lib/utils";

const statusBadgeStyles: Record<ReservationStatus, string> = {
  pending: "bg-calmo-blue/35 text-calmo-burnt-brown",
  confirmed: "bg-calmo-blue/50 text-calmo-burnt-brown",
  cancelled_by_customer: "bg-calmo-red-brown/12 text-calmo-red-brown",
  cancelled_by_restaurant: "bg-calmo-red-brown/12 text-calmo-red-brown",
  completed: "bg-calmo-burnt-brown/10 text-calmo-burnt-brown",
  no_show: "bg-calmo-burnt-brown/10 text-calmo-burnt-brown",
};

export function AdminReservationTable() {
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [status, setStatus] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ date });
      if (status) params.set("status", status);

      const response = await fetch(`/api/admin/reservations?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to load reservations.");
        setReservations([]);
        return;
      }

      setReservations(data.reservations ?? []);
    } catch {
      setError("Unable to load reservations.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [date, status]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const runAction = async (id: string, action: "confirm" | "cancel" | "complete" | "no_show") => {
    setActionLoadingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Action failed.");
        return;
      }

      await loadReservations();
    } catch {
      setError("Action failed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Date" htmlFor="admin-date">
          <Input
            id="admin-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormField>

        <FormField label="Status" htmlFor="admin-status">
          <Select
            id="admin-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {RESERVATION_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      {error ? (
        <p className="rounded-2xl border border-calmo-red-brown/20 bg-calmo-red-brown/5 px-4 py-3 font-body text-sm text-calmo-red-brown">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="font-body text-sm text-calmo-burnt-brown/60">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p className="font-body text-sm text-calmo-burnt-brown/60">
          No reservations for {formatReservationDate(date)}.
        </p>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <article
              key={reservation.id}
              className="rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-title text-lg font-bold text-calmo-burnt-brown">
                    {reservation.customer_name}
                  </p>
                  <p className="mt-1 font-body text-sm text-calmo-burnt-brown/70">
                    {formatReservationTime(reservation.reservation_time)} · Party of{" "}
                    {reservation.party_size}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em]",
                    statusBadgeStyles[reservation.status],
                  )}
                >
                  {STATUS_LABELS[reservation.status]}
                </span>
              </div>

              <div className="mt-4 grid gap-2 font-body text-sm text-calmo-burnt-brown/75 sm:grid-cols-2">
                <p>{reservation.customer_email}</p>
                <p>{reservation.customer_phone}</p>
                {reservation.notes ? (
                  <p className="sm:col-span-2 italic text-calmo-burnt-brown/60">
                    {reservation.notes}
                  </p>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {reservation.status === "pending" ? (
                  <Button
                    variant="dark"
                    className="px-5 py-2.5 text-[11px]"
                    disabled={actionLoadingId === reservation.id}
                    onClick={() => runAction(reservation.id, "confirm")}
                  >
                    Confirm
                  </Button>
                ) : null}
                {reservation.status === "pending" || reservation.status === "confirmed" ? (
                  <Button
                    variant="secondary"
                    className="px-5 py-2.5 text-[11px]"
                    disabled={actionLoadingId === reservation.id}
                    onClick={() => runAction(reservation.id, "cancel")}
                  >
                    Cancel
                  </Button>
                ) : null}
                {reservation.status === "confirmed" ? (
                  <>
                    <Button
                      variant="secondary"
                      className="px-5 py-2.5 text-[11px]"
                      disabled={actionLoadingId === reservation.id}
                      onClick={() => runAction(reservation.id, "complete")}
                    >
                      Completed
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-5 py-2.5 text-[11px]"
                      disabled={actionLoadingId === reservation.id}
                      onClick={() => runAction(reservation.id, "no_show")}
                    >
                      No-show
                    </Button>
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
