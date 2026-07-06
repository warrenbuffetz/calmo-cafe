"use client";

import { useCallback, useState } from "react";
import type { ReservationAction } from "@/components/admin/reservation-styles";

export function useReservationAction(onSuccess?: () => Promise<void> | void) {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAction = useCallback(
    async (id: string, action: ReservationAction) => {
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

        await onSuccess?.();
      } catch {
        setError("Action failed.");
      } finally {
        setActionLoadingId(null);
      }
    },
    [onSuccess],
  );

  return { actionLoadingId, error, setError, runAction };
}
