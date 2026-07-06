import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { sectionContent } from "@/lib/section";

export const metadata: Metadata = {
  title: "Request a table — Calmo",
  description: "Request a brunch or coffee reservation at Calmo on Dundas West.",
};

export default function ReservationsPage() {
  return (
    <SiteChrome>
      <section className={sectionContent}>
        <div className="mx-auto max-w-xl">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Reservations
          </p>
          <h1 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl">
            Request a table
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
            Walk-ins are always welcome. For larger groups or a set time, send a request and
            we&apos;ll confirm by email.
          </p>
          <div className="mt-10">
            <ReservationForm />
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
