"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { ModifyConfirmModal } from "@/components/reservation/ModifyConfirmModal";
import {
  formatReservationDate,
  formatReservationTime,
  getMaxBookingDate,
  getMinBookingDate,
  getTimeSlotsForDate,
} from "@/lib/reservations/time-slots";
import type { Reservation } from "@/lib/reservations/types";

type FormState = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: string;
  reservation_date: string;
  reservation_time: string;
  notes: string;
};

function reservationToFormState(reservation: Reservation): FormState {
  return {
    customer_name: reservation.customer_name,
    customer_email: reservation.customer_email,
    customer_phone: reservation.customer_phone,
    party_size: String(reservation.party_size),
    reservation_date: reservation.reservation_date,
    reservation_time: reservation.reservation_time,
    notes: reservation.notes ?? "",
  };
}

function formatBookingSummary(
  date: string,
  time: string,
  partySize: string | number,
): string {
  const guests = Number(partySize);
  return `${formatReservationDate(date)} · ${formatReservationTime(time)} · party of ${guests}`;
}

type ModifyReservationFormProps = {
  reservation: Reservation;
};

export function ModifyReservationForm({ reservation }: ModifyReservationFormProps) {
  const [form, setForm] = useState<FormState>(() => reservationToFormState(reservation));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  const minDate = getMinBookingDate();
  const maxDate = getMaxBookingDate();

  const timeSlots = useMemo(
    () => (form.reservation_date ? getTimeSlotsForDate(form.reservation_date) : []),
    [form.reservation_date],
  );

  useEffect(() => {
    if (timeSlots.length > 0 && !timeSlots.includes(form.reservation_time)) {
      setForm((prev) => ({ ...prev, reservation_time: timeSlots[0] }));
    }
  }, [timeSlots, form.reservation_time]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "reservation_date") {
        const slots = getTimeSlotsForDate(value);
        next.reservation_time = slots[0] ?? "";
      }

      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  };

  const validateForm = (): boolean => {
    if (timeSlots.length === 0) {
      setServerError("Please choose a date when we're open.");
      return false;
    }

    if (!form.reservation_time) {
      setServerError("Please choose a valid time.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    if (!validateForm()) return;

    setServerError(null);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (submitting) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch(`/api/reservations/modify/${reservation.cancellation_token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          party_size: Number(form.party_size),
        }),
      });

      let data: {
        error?: string;
        fieldErrors?: Partial<Record<keyof FormState, string>>;
        cancellation_token?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        if (!response.ok) {
          setServerError("Something went wrong. Please try again.");
          setConfirmOpen(false);
          return;
        }
      }

      if (!response.ok) {
        setConfirmOpen(false);
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setConfirmOpen(false);
      setSuccessToken(data.cancellation_token ?? null);
    } catch {
      setConfirmOpen(false);
      setServerError("Unable to submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const oldSummary = formatBookingSummary(
    reservation.reservation_date,
    reservation.reservation_time,
    reservation.party_size,
  );

  const newSummary = formatBookingSummary(
    form.reservation_date,
    form.reservation_time,
    form.party_size,
  );

  if (successToken) {
    return (
      <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-8 text-center sm:p-10">
        <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
          Updated request received
        </p>
        <h2 className="mt-4 font-title text-3xl font-bold text-calmo-burnt-brown">
          We&apos;ve got your new request
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
          Your previous booking has been cancelled. We&apos;ll review your updated details and email
          you once your new reservation is confirmed.
        </p>
        <div className="mt-8">
          <Link
            href={`/reservations/manage/${successToken}`}
            className="inline-flex items-center justify-center rounded-full bg-calmo-burnt-brown px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.14em] text-calmo-beige transition-all hover:bg-calmo-blue hover:text-calmo-burnt-brown"
          >
            View updated booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 rounded-2xl border border-calmo-burnt-brown/10 bg-white/60 p-6">
        <p className="font-body text-sm leading-relaxed text-calmo-burnt-brown/75">
          Updating your booking will cancel your current reservation and send a new request for us to
          confirm.
        </p>
        <p className="mt-3 font-body text-sm text-calmo-burnt-brown/60">
          Current booking:{" "}
          <span className="font-medium text-calmo-burnt-brown">{oldSummary}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Date" htmlFor="reservation_date" error={errors.reservation_date}>
            <Input
              id="reservation_date"
              type="date"
              min={minDate}
              max={maxDate}
              value={form.reservation_date}
              onChange={(e) => updateField("reservation_date", e.target.value)}
              error={Boolean(errors.reservation_date)}
              required
            />
          </FormField>

          <FormField label="Time" htmlFor="reservation_time" error={errors.reservation_time}>
            <Select
              id="reservation_time"
              value={form.reservation_time}
              onChange={(e) => updateField("reservation_time", e.target.value)}
              error={Boolean(errors.reservation_time)}
              required
              disabled={timeSlots.length === 0}
            >
              {timeSlots.length === 0 ? (
                <option value="">Closed this day</option>
              ) : (
                timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))
              )}
            </Select>
          </FormField>
        </div>

        <FormField label="Party size" htmlFor="party_size" error={errors.party_size}>
          <Select
            id="party_size"
            value={form.party_size}
            onChange={(e) => updateField("party_size", e.target.value)}
            error={Boolean(errors.party_size)}
            required
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((size) => (
              <option key={size} value={size}>
                {size} {size === 1 ? "guest" : "guests"}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Name" htmlFor="customer_name" error={errors.customer_name}>
          <Input
            id="customer_name"
            type="text"
            autoComplete="name"
            value={form.customer_name}
            onChange={(e) => updateField("customer_name", e.target.value)}
            error={Boolean(errors.customer_name)}
            required
          />
        </FormField>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Email" htmlFor="customer_email" error={errors.customer_email}>
            <Input
              id="customer_email"
              type="email"
              autoComplete="email"
              value={form.customer_email}
              onChange={(e) => updateField("customer_email", e.target.value)}
              error={Boolean(errors.customer_email)}
              required
            />
          </FormField>

          <FormField label="Phone" htmlFor="customer_phone" error={errors.customer_phone}>
            <Input
              id="customer_phone"
              type="tel"
              autoComplete="tel"
              value={form.customer_phone}
              onChange={(e) => updateField("customer_phone", e.target.value)}
              error={Boolean(errors.customer_phone)}
              required
            />
          </FormField>
        </div>

        <FormField label="Notes (optional)" htmlFor="notes" error={errors.notes}>
          <Textarea
            id="notes"
            placeholder="Occasion, allergies, seating preferences..."
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            error={Boolean(errors.notes)}
          />
        </FormField>

        {serverError ? (
          <p className="rounded-2xl border border-calmo-red-brown/20 bg-calmo-red-brown/5 px-4 py-3 font-body text-sm text-calmo-red-brown">
            {serverError}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={`/reservations/manage/${reservation.cancellation_token}`}
            className="inline-flex items-center justify-center rounded-full border border-calmo-burnt-brown/15 bg-transparent px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.14em] text-calmo-burnt-brown transition-all hover:border-calmo-blue hover:bg-calmo-blue/20"
          >
            Go back
          </Link>
          <Button type="submit" variant="dark" disabled={submitting || timeSlots.length === 0}>
            Submit new request
          </Button>
        </div>
      </form>

      <ModifyConfirmModal
        open={confirmOpen}
        oldSummary={oldSummary}
        newSummary={newSummary}
        submitting={submitting}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!submitting) setConfirmOpen(false);
        }}
      />
    </>
  );
}
