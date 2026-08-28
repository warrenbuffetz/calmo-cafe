import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { sectionContent } from "@/lib/section";

export const metadata: Metadata = {
  title: "Admin — Calmo",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <SiteChrome>
      <section className={sectionContent}>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
                Staff
              </p>
              <h1 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl">
                Site content
              </h1>
              <p className="mt-4 font-body text-sm text-calmo-burnt-brown/70">
                Update homepage copy without redeploying the site.
              </p>
            </div>
            <AdminSignOut />
          </div>
          <div className="mt-10">
            <AdminDashboard />
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
