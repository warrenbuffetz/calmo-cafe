import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { CancelReservationClient } from "@/components/reservation/CancelReservationClient";
import { getReservationByToken } from "@/lib/reservations/queries";
import { sectionShell } from "@/lib/section";

export const metadata: Metadata = {
  title: "Cancel reservation — Calmo",
  robots: { index: false, follow: false },
};

type CancelPageProps = {
  params: Promise<{ token: string }>;
};

export default async function CancelReservationPage({ params }: CancelPageProps) {
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
      <section className={sectionShell}>
        <div className="mx-auto max-w-xl">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Reservations
          </p>
          <h1 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl">
            Cancel reservation
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
            Need to cancel? Use the link in your confirmation email.
          </p>
          <div className="mt-10">
            <CancelReservationClient reservation={reservation} />
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
