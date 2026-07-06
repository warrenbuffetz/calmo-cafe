"use client";

import { Button } from "@/components/ui/Button";
import type { Reservation } from "@/lib/reservations/types";
import type { ReservationAction } from "@/components/admin/reservation-styles";

type AdminReservationActionsProps = {
  reservation: Reservation;
  actionLoadingId: string | null;
  onAction: (id: string, action: ReservationAction) => void;
  compact?: boolean;
};

export function AdminReservationActions({
  reservation,
  actionLoadingId,
  onAction,
  compact = false,
}: AdminReservationActionsProps) {
  const isLoading = actionLoadingId === reservation.id;
  const buttonClass = compact ? "px-4 py-2 text-[10px]" : "px-5 py-2.5 text-[11px]";

  return (
    <div className="flex flex-wrap gap-2">
      {reservation.status === "pending" ? (
        <Button
          variant="dark"
          className={buttonClass}
          disabled={isLoading}
          onClick={() => onAction(reservation.id, "confirm")}
        >
          Confirm
        </Button>
      ) : null}
      {reservation.status === "pending" || reservation.status === "confirmed" ? (
        <Button
          variant="secondary"
          className={buttonClass}
          disabled={isLoading}
          onClick={() => onAction(reservation.id, "cancel")}
        >
          Cancel
        </Button>
      ) : null}
      {reservation.status === "confirmed" ? (
        <>
          <Button
            variant="secondary"
            className={buttonClass}
            disabled={isLoading}
            onClick={() => onAction(reservation.id, "complete")}
          >
            Completed
          </Button>
          <Button
            variant="secondary"
            className={buttonClass}
            disabled={isLoading}
            onClick={() => onAction(reservation.id, "no_show")}
          >
            No-show
          </Button>
        </>
      ) : null}
    </div>
  );
}
