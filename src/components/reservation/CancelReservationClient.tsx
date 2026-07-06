"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  formatReservationDate,
  formatReservationTime,
} from "@/lib/reservations/time-slots";
import type { Reservation } from "@/lib/reservations/types";
import { CANCELLED_STATUSES } from "@/lib/reservations/types";

type CancelReservationClientProps = {
  reservation: Reservation;
};

export function CancelReservationClient({ reservation }: CancelReservationClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [cancelled, setCancelled] = useState(
    CANCELLED_STATUSES.includes(reservation.status),
  );
  const [error, setError] = useState<string | null>(null);

  const isTerminal =
    cancelled ||
    reservation.status === "completed" ||
    reservation.status === "no_show";

  const handleCancel = async () => {
    if (submitting || isTerminal) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/reservations/cancel/${reservation.cancellation_token}`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to cancel right now.");
        return;
      }

      setCancelled(true);
      router.refresh();
    } catch {
      setError("Unable to cancel right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cancelled) {
    return (
      <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-8 text-center sm:p-10">
        <h2 className="font-title text-2xl font-bold text-calmo-burnt-brown">
          Reservation cancelled
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
          Your request has been cancelled. We hope to see you at Calmo soon.
        </p>
      </div>
    );
  }

  if (reservation.status === "completed" || reservation.status === "no_show") {
    return (
      <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-8 text-center sm:p-10">
        <h2 className="font-title text-2xl font-bold text-calmo-burnt-brown">
          This reservation can&apos;t be cancelled
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
          This booking is already closed. Contact us if you need help.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-8 sm:p-10">
      <h2 className="font-title text-2xl font-bold text-calmo-burnt-brown">
        Cancel your reservation?
      </h2>
      <div className="mt-6 space-y-2 font-body text-sm text-calmo-burnt-brown/75">
        <p>
          <strong>Date:</strong> {formatReservationDate(reservation.reservation_date)}
        </p>
        <p>
          <strong>Time:</strong> {formatReservationTime(reservation.reservation_time)}
        </p>
        <p>
          <strong>Party size:</strong> {reservation.party_size}
        </p>
        <p>
          <strong>Name:</strong> {reservation.customer_name}
        </p>
      </div>

      {error ? (
        <p className="mt-4 font-body text-sm text-calmo-red-brown">{error}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="dark" onClick={handleCancel} disabled={submitting}>
          {submitting ? "Cancelling..." : "Confirm cancellation"}
        </Button>
        <Button variant="secondary" onClick={() => (window.location.href = "/")}>
          Keep reservation
        </Button>
      </div>
    </div>
  );
}
