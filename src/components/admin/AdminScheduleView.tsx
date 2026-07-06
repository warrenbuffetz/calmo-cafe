"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminReservationActions } from "@/components/admin/AdminReservationActions";
import { statusBadgeStyles } from "@/components/admin/reservation-styles";
import { useReservationAction } from "@/components/admin/useReservationAction";
import {
  getScheduleSummary,
  getScheduleSummaryParts,
} from "@/lib/reservations/schedule-summary";
import {
  formatReservationDate,
  formatReservationDateShort,
  formatReservationTime,
  getMinBookingDate,
  getScheduleRange,
  getScheduleWeekDates,
} from "@/lib/reservations/time-slots";
import { STATUS_LABELS, type Reservation } from "@/lib/reservations/types";
import { cn } from "@/lib/utils";

function groupByTime(reservations: Reservation[]): Map<string, Reservation[]> {
  const groups = new Map<string, Reservation[]>();

  for (const reservation of reservations) {
    const existing = groups.get(reservation.reservation_time) ?? [];
    existing.push(reservation);
    groups.set(reservation.reservation_time, existing);
  }

  return groups;
}

function ScheduleSummaryHeader({ reservations }: { reservations: Reservation[] }) {
  const summary = useMemo(() => getScheduleSummary(reservations), [reservations]);
  const parts = useMemo(() => getScheduleSummaryParts(summary), [summary]);

  return (
    <div>
      <p className="font-title text-lg font-bold text-calmo-burnt-brown">
        {parts.map((part, index) => (
          <span key={`${part.text}-${index}`}>
            {index > 0 ? (
              <span className="font-body font-normal text-calmo-burnt-brown/40"> · </span>
            ) : null}
            <span
              className={cn(
                part.variant === "pending" ? "text-calmo-red-brown" : undefined,
                part.text === "this week" ? "font-body text-sm font-normal text-calmo-burnt-brown/60" : undefined,
              )}
            >
              {part.text}
            </span>
          </span>
        ))}
      </p>
      <p className="mt-2 font-body text-sm text-calmo-burnt-brown/60">
        Tap a day to view reservations. Tap a guest for details.
      </p>
    </div>
  );
}

function ScheduleDayStrip({
  weekDates,
  today,
  selectedDate,
  reservationsByDate,
  onSelectDate,
}: {
  weekDates: string[];
  today: string;
  selectedDate: string;
  reservationsByDate: Map<string, Reservation[]>;
  onSelectDate: (date: string) => void;
}) {
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const button = dayRefs.current.get(selectedDate);
    button?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [selectedDate]);

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 snap-x snap-mandatory scroll-smooth">
      {weekDates.map((date) => {
        const count = reservationsByDate.get(date)?.length ?? 0;
        const isToday = date === today;
        const isSelected = date === selectedDate;

        return (
          <button
            key={date}
            ref={(node) => {
              if (node) {
                dayRefs.current.set(date, node);
              } else {
                dayRefs.current.delete(date);
              }
            }}
            type="button"
            onClick={() => onSelectDate(date)}
            className={cn(
              "flex w-[4.5rem] shrink-0 snap-center flex-col items-center rounded-2xl border px-2 py-3 transition-all",
              isSelected
                ? "border-calmo-burnt-brown/30 bg-calmo-burnt-brown text-calmo-beige"
                : "border-calmo-burnt-brown/10 bg-calmo-beige/60 text-calmo-burnt-brown hover:border-calmo-burnt-brown/20",
            )}
          >
            <span className="font-body text-[10px] font-medium uppercase tracking-[0.12em]">
              {isToday ? "Today" : formatReservationDateShort(date).split(" ")[0]}
            </span>
            <span className="mt-1 font-title text-lg font-bold">
              {new Date(`${date}T12:00:00`).getDate()}
            </span>
            {count > 0 ? (
              <span
                className={cn(
                  "mt-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  isSelected ? "bg-calmo-beige/20 text-calmo-beige" : "bg-calmo-blue/40",
                )}
              >
                {count}
              </span>
            ) : (
              <span className="mt-1 h-5" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ScheduleReservationCard({
  reservation,
  actionLoadingId,
  onAction,
}: {
  reservation: Reservation;
  actionLoadingId: string | null;
  onAction: (id: string, action: "confirm" | "cancel" | "complete" | "no_show") => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-4">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setExpanded((value) => !value)}
      >
        <div className="min-w-0 flex-1">
          <p className="font-title text-base font-bold text-calmo-burnt-brown">
            {reservation.customer_name}
          </p>
          <p className="mt-0.5 font-body text-sm text-calmo-burnt-brown/70">
            Party of {reservation.party_size}
            {reservation.notes ? (
              <span className="text-calmo-burnt-brown/50"> · {reservation.notes}</span>
            ) : null}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.14em]",
            statusBadgeStyles[reservation.status],
          )}
        >
          {STATUS_LABELS[reservation.status]}
        </span>
      </button>

      {expanded ? (
        <div className="mt-4 space-y-4 border-t border-calmo-burnt-brown/10 pt-4">
          <div className="grid gap-1 font-body text-sm text-calmo-burnt-brown/75">
            <p>{reservation.customer_email}</p>
            <p>{reservation.customer_phone}</p>
            {reservation.notes ? (
              <p className="italic text-calmo-burnt-brown/60">{reservation.notes}</p>
            ) : null}
          </div>
          <AdminReservationActions
            reservation={reservation}
            actionLoadingId={actionLoadingId}
            onAction={onAction}
            compact
          />
        </div>
      ) : null}
    </article>
  );
}

function DayScheduleSection({
  date,
  reservations,
  isToday,
  actionLoadingId,
  onAction,
}: {
  date: string;
  reservations: Reservation[];
  isToday: boolean;
  actionLoadingId: string | null;
  onAction: (id: string, action: "confirm" | "cancel" | "complete" | "no_show") => void;
}) {
  const timeGroups = groupByTime(reservations);
  const sortedTimes = [...timeGroups.keys()].sort();

  return (
    <section>
      <h3
        className={cn(
          "font-title text-lg font-bold",
          isToday ? "text-calmo-burnt-brown" : "text-calmo-burnt-brown/80",
        )}
      >
        {isToday ? "Today" : formatReservationDateShort(date)}
        <span className="ml-2 font-body text-sm font-normal text-calmo-burnt-brown/50">
          {formatReservationDate(date).split(",").slice(1).join(",").trim()}
        </span>
      </h3>

      {reservations.length === 0 ? (
        <p className="mt-3 font-body text-sm text-calmo-burnt-brown/50">Nothing booked.</p>
      ) : (
        <div className="mt-4 space-y-5">
          {sortedTimes.map((time) => (
            <div key={time}>
              <p className="font-body text-xs font-medium uppercase tracking-[0.16em] text-calmo-red-brown">
                {formatReservationTime(time)}
              </p>
              <div className="mt-2 space-y-2">
                {timeGroups.get(time)?.map((reservation) => (
                  <ScheduleReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    actionLoadingId={actionLoadingId}
                    onAction={onAction}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function AdminScheduleView() {
  const weekDates = useMemo(() => getScheduleWeekDates(), []);
  const today = getMinBookingDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const reservationsByDate = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const date of weekDates) {
      map.set(date, []);
    }
    for (const reservation of reservations) {
      const dayReservations = map.get(reservation.reservation_date) ?? [];
      dayReservations.push(reservation);
      map.set(reservation.reservation_date, dayReservations);
    }
    return map;
  }, [reservations, weekDates]);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    const { from, to } = getScheduleRange();
    const params = new URLSearchParams({
      status: "active",
      from,
      to,
    });

    try {
      const response = await fetch(`/api/admin/reservations?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setFetchError(data.error ?? "Unable to load schedule.");
        setReservations([]);
        return;
      }

      setReservations(data.reservations ?? []);
    } catch {
      setFetchError("Unable to load schedule.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const { actionLoadingId, error: actionError, runAction } = useReservationAction(loadReservations);
  const error = fetchError ?? actionError;

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const selectedReservations = reservationsByDate.get(selectedDate) ?? [];

  return (
    <div className="space-y-6">
      {!loading ? <ScheduleSummaryHeader reservations={reservations} /> : null}

      <ScheduleDayStrip
        weekDates={weekDates}
        today={today}
        selectedDate={selectedDate}
        reservationsByDate={reservationsByDate}
        onSelectDate={setSelectedDate}
      />

      {error ? (
        <p className="rounded-2xl border border-calmo-red-brown/20 bg-calmo-red-brown/5 px-4 py-3 font-body text-sm text-calmo-red-brown">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="font-body text-sm text-calmo-burnt-brown/60">Loading schedule...</p>
      ) : (
        <DayScheduleSection
          date={selectedDate}
          reservations={selectedReservations}
          isToday={selectedDate === today}
          actionLoadingId={actionLoadingId}
          onAction={runAction}
        />
      )}
    </div>
  );
}
