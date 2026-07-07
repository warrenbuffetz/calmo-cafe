import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteChrome } from "@/components/SiteChrome";
import { ModifyReservationForm } from "@/components/reservation/ModifyReservationForm";
import { getReservationByToken } from "@/lib/reservations/queries";
import { isReservationModifiable } from "@/lib/reservations/types";
import { sectionContent } from "@/lib/section";

export const metadata: Metadata = {
  title: "Modify reservation — Calmo",
  robots: { index: false, follow: false },
};

type ModifyPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ModifyReservationPage({ params }: ModifyPageProps) {
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

  if (!isReservationModifiable(reservation.status)) {
    redirect(`/reservations/manage/${token}`);
  }

  return (
    <SiteChrome>
      <section className={sectionContent}>
        <div className="mx-auto max-w-xl">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Reservations
          </p>
          <h1 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl">
            Modify reservation
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
            Update your details below. We&apos;ll cancel your current booking and review your new
            request.
          </p>
          <div className="mt-10">
            <ModifyReservationForm reservation={reservation} />
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
