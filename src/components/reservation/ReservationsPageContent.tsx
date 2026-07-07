"use client";

import { useEffect, useRef, useState } from "react";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { ReservationSuccess } from "@/components/reservation/ReservationSuccess";

export function ReservationsPageContent() {
  const [submitted, setSubmitted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submitted]);

  if (submitted) {
    return (
      <div ref={contentRef} className="mx-auto max-w-xl">
        <ReservationSuccess />
      </div>
    );
  }

  return (
    <div ref={contentRef} className="mx-auto max-w-xl">
      <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
        Reservations
      </p>
      <h1 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl">
        Request a table
      </h1>
      <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
        Walk-ins are always welcome. For larger groups or a set time, send a request and we&apos;ll
        confirm by email.
      </p>
      <div className="mt-10">
        <ReservationForm onSuccess={() => setSubmitted(true)} />
      </div>
    </div>
  );
}
