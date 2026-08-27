"use client";

import Link from "next/link";
import {
  formatReservationDate,
  formatReservationTime,
} from "@/lib/reservations/time-slots";
import { isMenuEnabled } from "@/lib/features";
import type { Reservation } from "@/lib/reservations/types";
import { CANCELLED_STATUSES, STATUS_LABELS } from "@/lib/reservations/types";
import { venue } from "@/lib/venue";
import { cn } from "@/lib/utils";

const menuLink = isMenuEnabled() ? "/#menu" : "/#gallery";
const menuLinkLabel = isMenuEnabled() ? "See menu" : "Follow along";

type ManageReservationClientProps = {
  reservation: Reservation;
};

const actionLinkClass =
  "inline-flex items-center justify-center rounded-full px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.14em] transition-all";

export function ManageReservationClient({ reservation }: ManageReservationClientProps) {
  const isCancelled = CANCELLED_STATUSES.includes(reservation.status);
  const isTerminal =
    isCancelled || reservation.status === "completed" || reservation.status === "no_show";
  const calendarUrl = `/api/reservations/calendar/${reservation.cancellation_token}`;
  const cancelUrl = `/reservations/cancel/${reservation.cancellation_token}`;
  const modifyUrl = `/reservations/manage/${reservation.cancellation_token}/modify`;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-8 sm:p-10">
        <p className="font-body text-xs font-medium uppercase tracking-[0.2em] text-calmo-red-brown">
          {STATUS_LABELS[reservation.status]}
        </p>
        <h2 className="mt-3 font-title text-2xl font-bold text-calmo-burnt-brown">
          {reservation.customer_name}
        </h2>
        <dl className="mt-6 space-y-3 font-body text-sm text-calmo-burnt-brown/75">
          <div className="flex justify-between gap-4 border-b border-calmo-burnt-brown/8 pb-3">
            <dt className="font-medium text-calmo-burnt-brown">Date</dt>
            <dd>{formatReservationDate(reservation.reservation_date)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-calmo-burnt-brown/8 pb-3">
            <dt className="font-medium text-calmo-burnt-brown">Time</dt>
            <dd>{formatReservationTime(reservation.reservation_time)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-calmo-burnt-brown/8 pb-3">
            <dt className="font-medium text-calmo-burnt-brown">Party size</dt>
            <dd>
              {reservation.party_size} guest{reservation.party_size === 1 ? "" : "s"}
            </dd>
          </div>
          {reservation.notes ? (
            <div className="flex justify-between gap-4 border-b border-calmo-burnt-brown/8 pb-3">
              <dt className="font-medium text-calmo-burnt-brown">Notes</dt>
              <dd className="text-right">{reservation.notes}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      {!isTerminal ? (
        <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-white/60 p-8 sm:p-10">
          <h3 className="font-title text-lg font-bold text-calmo-burnt-brown">Your reservation</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
            Add this to your calendar, browse the menu, or get directions. Need a change? Update your
            details and we&apos;ll review the new request.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={calendarUrl}
              download
              className={cn(
                actionLinkClass,
                "bg-calmo-burnt-brown text-calmo-beige hover:bg-calmo-blue hover:text-calmo-burnt-brown",
              )}
            >
              Add to calendar
            </a>
            <Link
              href={modifyUrl}
              className={cn(
                actionLinkClass,
                "border border-calmo-burnt-brown/15 bg-transparent text-calmo-burnt-brown hover:border-calmo-blue hover:bg-calmo-blue/20",
              )}
            >
              Modify
            </Link>
            <Link
              href={cancelUrl}
              className={cn(
                actionLinkClass,
                "border border-calmo-burnt-brown/15 bg-transparent text-calmo-burnt-brown hover:border-calmo-blue hover:bg-calmo-blue/20",
              )}
            >
              Cancel
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={menuLink}
              className={cn(
                actionLinkClass,
                "border border-calmo-burnt-brown/15 bg-transparent text-calmo-burnt-brown hover:border-calmo-blue hover:bg-calmo-blue/20",
              )}
            >
              {menuLinkLabel}
            </Link>
            <a
              href={venue.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                actionLinkClass,
                "border border-calmo-burnt-brown/15 bg-transparent text-calmo-burnt-brown hover:border-calmo-blue hover:bg-calmo-blue/20",
              )}
            >
              Get directions
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-white/60 p-8 text-center sm:p-10">
          <p className="font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
            This reservation is no longer active. Walk-ins are always welcome — we&apos;d love to see
            you at Calmo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={menuLink}
              className={cn(
                actionLinkClass,
                "border border-calmo-burnt-brown/15 bg-transparent text-calmo-burnt-brown hover:border-calmo-blue hover:bg-calmo-blue/20",
              )}
            >
              {menuLinkLabel}
            </Link>
            <a
              href={venue.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                actionLinkClass,
                "border border-calmo-burnt-brown/15 bg-transparent text-calmo-burnt-brown hover:border-calmo-blue hover:bg-calmo-blue/20",
              )}
            >
              Get directions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
