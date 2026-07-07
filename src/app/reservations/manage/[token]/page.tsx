import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { ManageReservationClient } from "@/components/reservation/ManageReservationClient";
import { getReservationByToken } from "@/lib/reservations/queries";
import { sectionContent } from "@/lib/section";

export const metadata: Metadata = {
  title: "Manage reservation — Calmo",
  robots: { index: false, follow: false },
};

type ManagePageProps = {
  params: Promise<{ token: string }>;
};

export default async function ManageReservationPage({ params }: ManagePageProps) {
  const { token } = await params;

  let reservation = null;
  try {
    reservation = await getReservationByToken(token);
  } catch {
    notFound();
  }

  if (!reservation) {
    notFound();
  }

  return (
    <SiteChrome>
      <section className={sectionContent}>
        <div className="mx-auto max-w-xl">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Reservations
          </p>
          <h1 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl">
            Manage reservation
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
            View your booking details, add to calendar, or request a change.
          </p>
          <div className="mt-10">
            <ManageReservationClient reservation={reservation} />
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
