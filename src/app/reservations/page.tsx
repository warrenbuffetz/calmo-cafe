import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { ReservationsPageContent } from "@/components/reservation/ReservationsPageContent";
import { sectionContent } from "@/lib/section";

import { venue } from "@/lib/venue";

export const metadata: Metadata = {
  title: "Request a table — Calmo",
  description: `Request a table at Calmo on Dundas West. ${venue.subtitle}`,
};

export default function ReservationsPage() {
  return (
    <SiteChrome>
      <section className={sectionContent}>
        <ReservationsPageContent />
      </section>
    </SiteChrome>
  );
}
