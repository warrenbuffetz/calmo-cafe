import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { AdminReservationTable } from "@/components/admin/AdminReservationTable";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { sectionContent } from "@/lib/section";

export const metadata: Metadata = {
  title: "Reservations admin — Calmo",
  robots: { index: false, follow: false },
};

export default function AdminReservationsPage() {
  return (
    <SiteChrome>
      <section className={sectionContent}>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
                Staff
              </p>
              <h1 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl">
                Reservations
              </h1>
              <p className="mt-4 font-body text-sm text-calmo-burnt-brown/70">
                Pending requests appear first. Filter by date or search for a guest when needed.
              </p>
            </div>
            <AdminSignOut />
          </div>
          <div className="mt-10">
            <AdminReservationTable />
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
