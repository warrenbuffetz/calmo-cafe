import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { ReservationsPageContent } from "@/components/reservation/ReservationsPageContent";
import { sectionContent } from "@/lib/section";

export const metadata: Metadata = {
  title: "Request a table — Calmo",
  description: "Request a brunch or coffee reservation at Calmo on Dundas West.",
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
