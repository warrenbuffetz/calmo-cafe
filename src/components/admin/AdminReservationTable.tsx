"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/FormField";
import {
  formatRequestedAt,
  formatReservationDate,
  formatReservationDateShort,
  formatReservationTime,
} from "@/lib/reservations/time-slots";
import {
  ADMIN_STATUS_TABS,
  STATUS_LABELS,
  type AdminStatusTab,
  type Reservation,
  type ReservationCounts,
} from "@/lib/reservations/types";
import { cn } from "@/lib/utils";

const statusBadgeStyles = {
  pending: "bg-calmo-blue/35 text-calmo-burnt-brown",
  confirmed: "bg-calmo-blue/50 text-calmo-burnt-brown",
  cancelled_by_customer: "bg-calmo-red-brown/12 text-calmo-red-brown",
  cancelled_by_restaurant: "bg-calmo-red-brown/12 text-calmo-red-brown",
  completed: "bg-calmo-burnt-brown/10 text-calmo-burnt-brown",
  no_show: "bg-calmo-burnt-brown/10 text-calmo-burnt-brown",
} as const;

function getEmptyMessage(
  statusTab: AdminStatusTab,
  dateFilter: string,
  searchQuery: string,
): string {
  if (statusTab === "pending" && !dateFilter && !searchQuery) {
    return "No pending requests — you're all caught up.";
  }
  return "No reservations match these filters.";
}

export function AdminReservationTable() {
  const [statusTab, setStatusTab] = useState<AdminStatusTab>("pending");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [counts, setCounts] = useState<ReservationCounts>({ pending: 0, confirmed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ status: statusTab });
      if (dateFilter) params.set("date", dateFilter);
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusTab === "past") params.set("sort", "recent");

      const response = await fetch(`/api/admin/reservations?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to load reservations.");
        setReservations([]);
        return;
      }

      setReservations(data.reservations ?? []);
      setCounts(data.counts ?? { pending: 0, confirmed: 0 });
    } catch {
      setError("Unable to load reservations.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [statusTab, dateFilter, debouncedSearch]);

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

  const showDateOnCards = !dateFilter;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {ADMIN_STATUS_TABS.map(({ id, label }) => {
          const count =
            id === "pending" ? counts.pending : id === "confirmed" ? counts.confirmed : null;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setStatusTab(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.12em] transition-all",
                statusTab === id
                  ? "bg-calmo-burnt-brown text-calmo-beige"
                  : "bg-calmo-beige/60 text-calmo-burnt-brown/70 hover:bg-calmo-blue/25 hover:text-calmo-burnt-brown",
              )}
            >
              {label}
              {count !== null && count > 0 ? (
                <span
                  className={cn(
                    "inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    statusTab === id ? "bg-calmo-beige/20 text-calmo-beige" : "bg-calmo-blue/40",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Filter by date" htmlFor="admin-date">
          <Input
            id="admin-date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <p className="mt-2 font-body text-xs text-calmo-burnt-brown/50">
            Leave empty to see all dates.
          </p>
          {dateFilter ? (
            <button
              type="button"
              onClick={() => setDateFilter("")}
              className="mt-1 font-body text-xs text-calmo-red-brown hover:text-calmo-blue"
            >
              Clear date
            </button>
          ) : null}
        </FormField>

        <FormField label="Search guest" htmlFor="admin-search">
          <Input
            id="admin-search"
            type="search"
            placeholder="Name, email, or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 font-body text-xs text-calmo-red-brown hover:text-calmo-blue"
            >
              Clear search
            </button>
          ) : null}
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
          {getEmptyMessage(statusTab, dateFilter, debouncedSearch)}
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
                    {showDateOnCards
                      ? `${formatReservationDateShort(reservation.reservation_date)} · `
                      : ""}
                    {formatReservationTime(reservation.reservation_time)} · Party of{" "}
                    {reservation.party_size}
                  </p>
                  {reservation.status === "pending" ? (
                    <p className="mt-1 font-body text-xs text-calmo-burnt-brown/45">
                      Requested {formatRequestedAt(reservation.created_at)}
                    </p>
                  ) : null}
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

              {dateFilter ? (
                <p className="mt-3 font-body text-xs text-calmo-burnt-brown/50">
                  {formatReservationDate(reservation.reservation_date)}
                </p>
              ) : null}

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
