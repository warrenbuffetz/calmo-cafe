"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminReservationActions } from "@/components/admin/AdminReservationActions";
import { statusBadgeStyles } from "@/components/admin/reservation-styles";
import { useReservationAction } from "@/components/admin/useReservationAction";
import {
  getScheduleSummary,
  getScheduleSummaryParts,
} from "@/lib/reservations/schedule-summary";
import {
  canAdvanceScheduleWeek,
  formatReservationDate,
  formatReservationDateShort,
  formatReservationTime,
  formatScheduleWeekLabel,
  getFullScheduleRange,
  getMinBookingDate,
  getScheduleDateRange,
  getScheduleWeekDates,
  parseScheduleWeekOffset,
} from "@/lib/reservations/time-slots";
import { STATUS_LABELS, type Reservation } from "@/lib/reservations/types";
import { cn } from "@/lib/utils";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollChipIntoView(
  container: HTMLDivElement,
  chip: HTMLButtonElement,
  behavior: ScrollBehavior = "smooth",
) {
  const scrollLeft = chip.offsetLeft - (container.clientWidth - chip.clientWidth) / 2;
  container.scrollTo({ left: scrollLeft, behavior });
}

function groupByTime(reservations: Reservation[]): Map<string, Reservation[]> {
  const groups = new Map<string, Reservation[]>();

  for (const reservation of reservations) {
    const existing = groups.get(reservation.reservation_time) ?? [];
    existing.push(reservation);
    groups.set(reservation.reservation_time, existing);
  }

  return groups;
}

function ScheduleSummaryHeader({
  reservations,
  initialLoading,
  isRefreshing,
  weekLabel,
}: {
  reservations: Reservation[];
  initialLoading: boolean;
  isRefreshing: boolean;
  weekLabel: string;
}) {
  const summary = useMemo(() => getScheduleSummary(reservations), [reservations]);
  const parts = useMemo(() => getScheduleSummaryParts(summary), [summary]);

  return (
    <div className={cn(isRefreshing && "schedule-refreshing")}>
      {initialLoading ? (
        <div className="space-y-2">
          <div className="h-7 w-56 max-w-full animate-pulse rounded-lg bg-calmo-burnt-brown/10" />
          <div className="h-4 w-24 animate-pulse rounded-lg bg-calmo-burnt-brown/5" />
        </div>
      ) : (
        <p className="font-title text-lg font-bold leading-snug text-calmo-burnt-brown">
          {parts.map((part, index) => (
            <span key={`${part.text}-${index}`}>
              {index > 0 ? (
                <span className="font-body font-normal text-calmo-burnt-brown/40"> · </span>
              ) : null}
              <span className={part.variant === "pending" ? "text-calmo-red-brown" : undefined}>
                {part.text}
              </span>
            </span>
          ))}
          {weekLabel ? (
            <span className="mt-1 block font-body text-sm font-normal text-calmo-burnt-brown/60">
              {weekLabel}
            </span>
          ) : null}
        </p>
      )}
      <p className="mt-2 font-body text-sm text-calmo-burnt-brown/60">
        Tap a day to view reservations. Tap a guest for details.
      </p>
    </div>
  );
}

function WeekNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "back" | "forward";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "back" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={direction === "back" ? "Previous week" : "Next week"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-[4.75rem] w-10 shrink-0 items-center justify-center rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 text-calmo-burnt-brown transition-[transform,background-color,border-color] duration-200 active:scale-95",
        disabled
          ? "pointer-events-none opacity-40"
          : "hover:border-calmo-burnt-brown/20 hover:bg-calmo-blue/25",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
    </button>
  );
}

function ScheduleDayStrip({
  allDates,
  today,
  selectedDate,
  reservationsByDate,
  canGoBack,
  canGoForward,
  onSelectDate,
  onPreviousWeek,
  onNextWeek,
}: {
  allDates: string[];
  today: string;
  selectedDate: string;
  reservationsByDate: Map<string, Reservation[]>;
  canGoBack: boolean;
  canGoForward: boolean;
  onSelectDate: (date: string) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const skipScrollRef = useRef(true);
  const hasScrolledToInitial = useRef(false);

  const scrollToSelectedDate = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = scrollContainerRef.current;
    const button = dayRefs.current.get(selectedDate);
    if (!container || !button) return;
    scrollChipIntoView(container, button, behavior);
  }, [selectedDate]);

  useEffect(() => {
    if (!hasScrolledToInitial.current) {
      hasScrolledToInitial.current = true;
      requestAnimationFrame(() => {
        scrollToSelectedDate(prefersReducedMotion() ? "auto" : "smooth");
      });
      return;
    }

    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }

    scrollToSelectedDate(prefersReducedMotion() ? "auto" : "smooth");
  }, [selectedDate, scrollToSelectedDate]);

  return (
    <div className="flex items-center gap-2">
      <WeekNavButton direction="back" disabled={!canGoBack} onClick={onPreviousWeek} />

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-calmo-beige to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-calmo-beige to-transparent"
          aria-hidden
        />
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-2">
            {allDates.map((date) => {
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
                    "schedule-day-chip flex w-[4.5rem] shrink-0 snap-center flex-col items-center rounded-2xl border px-2 py-3 transition-[transform,background-color,border-color,box-shadow] duration-200",
                    isSelected
                      ? "scale-[1.03] border-calmo-burnt-brown/30 bg-calmo-burnt-brown text-calmo-beige shadow-sm"
                      : "scale-100 border-calmo-burnt-brown/10 bg-calmo-beige/60 text-calmo-burnt-brown hover:border-calmo-burnt-brown/20",
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
        </div>
      </div>

      <WeekNavButton direction="forward" disabled={!canGoForward} onClick={onNextWeek} />
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
  isRefreshing,
  onAction,
}: {
  date: string;
  reservations: Reservation[];
  isToday: boolean;
  actionLoadingId: string | null;
  isRefreshing: boolean;
  onAction: (id: string, action: "confirm" | "cancel" | "complete" | "no_show") => void;
}) {
  const timeGroups = groupByTime(reservations);
  const sortedTimes = [...timeGroups.keys()].sort();

  return (
    <section className={cn("animate-schedule-detail-in", isRefreshing && "schedule-refreshing")}>
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = getMinBookingDate();
  const allScheduleDates = useMemo(() => getScheduleDateRange(), []);
  const initialWeekOffset = parseScheduleWeekOffset(searchParams.get("week"));
  const [weekOffset, setWeekOffset] = useState(initialWeekOffset);
  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = getScheduleWeekDates(initialWeekOffset);
    return dates[0] ?? today;
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);

  const weekDates = useMemo(() => getScheduleWeekDates(weekOffset), [weekOffset]);
  const weekLabel = useMemo(
    () => formatScheduleWeekLabel(weekDates, weekOffset),
    [weekDates, weekOffset],
  );
  const canGoBack = weekOffset > 0;
  const canGoForward = canAdvanceScheduleWeek(weekOffset);

  const weekReservations = useMemo(() => {
    const weekDateSet = new Set(weekDates);
    return reservations.filter((reservation) => weekDateSet.has(reservation.reservation_date));
  }, [reservations, weekDates]);

  const syncWeekToUrl = useCallback(
    (offset: number) => {
      const currentOffset = parseScheduleWeekOffset(searchParams.get("week"));
      if (currentOffset === offset && searchParams.get("view") === "schedule") {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("view", "schedule");
      if (offset > 0) {
        params.set("week", String(offset));
      } else {
        params.delete("week");
      }
      router.replace(`/reservations/admin?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const changeWeek = useCallback(
    (nextOffset: number) => {
      const dates = getScheduleWeekDates(nextOffset);
      setWeekOffset(nextOffset);
      setSelectedDate(dates[0] ?? today);
      syncWeekToUrl(nextOffset);
    },
    [syncWeekToUrl, today],
  );

  const weekParam = searchParams.get("week");

  useEffect(() => {
    const urlOffset = parseScheduleWeekOffset(weekParam);
    setWeekOffset((current) => (current === urlOffset ? current : urlOffset));
  }, [weekParam]);

  useEffect(() => {
    if (weekDates.length === 0) return;
    setSelectedDate((current) => (weekDates.includes(current) ? current : weekDates[0]));
  }, [weekDates]);

  const reservationsByDate = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const date of allScheduleDates) {
      map.set(date, []);
    }
    for (const reservation of reservations) {
      const dayReservations = map.get(reservation.reservation_date) ?? [];
      dayReservations.push(reservation);
      map.set(reservation.reservation_date, dayReservations);
    }
    return map;
  }, [reservations, allScheduleDates]);

  const loadReservations = useCallback(async (options?: { refresh?: boolean }) => {
    const isRefresh = options?.refresh ?? hasLoadedOnce.current;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setInitialLoading(true);
    }
    setFetchError(null);

    const { from, to } = getFullScheduleRange();
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
        if (!isRefresh) {
          setReservations([]);
        }
        return;
      }

      setReservations(data.reservations ?? []);
      hasLoadedOnce.current = true;
    } catch {
      setFetchError("Unable to load schedule.");
      if (!isRefresh) {
        setReservations([]);
      }
    } finally {
      setInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const refreshReservations = useCallback(
    () => loadReservations({ refresh: true }),
    [loadReservations],
  );

  const { actionLoadingId, error: actionError, runAction } =
    useReservationAction(refreshReservations);
  const error = fetchError ?? actionError;

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const selectedReservations = reservationsByDate.get(selectedDate) ?? [];

  return (
    <div className="space-y-6">
      <ScheduleSummaryHeader
        reservations={weekReservations}
        initialLoading={initialLoading}
        isRefreshing={isRefreshing}
        weekLabel={weekLabel}
      />

      <ScheduleDayStrip
        allDates={allScheduleDates}
        today={today}
        selectedDate={selectedDate}
        reservationsByDate={reservationsByDate}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onSelectDate={setSelectedDate}
        onPreviousWeek={() => changeWeek(weekOffset - 1)}
        onNextWeek={() => changeWeek(weekOffset + 1)}
      />

      {error ? (
        <p className="rounded-2xl border border-calmo-red-brown/20 bg-calmo-red-brown/5 px-4 py-3 font-body text-sm text-calmo-red-brown">
          {error}
        </p>
      ) : null}

      <DayScheduleSection
        key={selectedDate}
        date={selectedDate}
        reservations={selectedReservations}
        isToday={selectedDate === today}
        actionLoadingId={actionLoadingId}
        isRefreshing={isRefreshing}
        onAction={runAction}
      />
    </div>
  );
}
