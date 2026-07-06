"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import {
  getMaxBookingDate,
  getMinBookingDate,
  getTimeSlotsForDate,
} from "@/lib/reservations/time-slots";

type FormState = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: string;
  reservation_date: string;
  reservation_time: string;
  notes: string;
};

const initialState: FormState = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  party_size: "2",
  reservation_date: "",
  reservation_time: "",
  notes: "",
};

function getInitialFormState(): FormState {
  const reservation_date = getMinBookingDate();
  const slots = getTimeSlotsForDate(reservation_date);

  return {
    ...initialState,
    reservation_date,
    reservation_time: slots[0] ?? "",
  };
}

export function ReservationForm() {
  const [form, setForm] = useState<FormState>(getInitialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

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
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          party_size: Number(form.party_size),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError("Unable to submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-8 text-center sm:p-10">
        <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
          Request received
        </p>
        <h2 className="mt-4 font-title text-3xl font-bold text-calmo-burnt-brown">
          We&apos;ll confirm your booking shortly
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
          Thanks for requesting a table at Calmo. We&apos;ll review your details and email you once
          your reservation is confirmed.
        </p>
        <p className="mt-6 font-accent text-sm italic text-calmo-burnt-brown/50">
          Need to cancel later? Use the link in your confirmation email.
        </p>
      </div>
    );
  }

  return (
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

      <div className="flex justify-center">
        <Button type="submit" variant="dark" disabled={submitting || timeSlots.length === 0}>
          {submitting ? "Sending request..." : "Request a table"}
        </Button>
      </div>
    </form>
  );
}
