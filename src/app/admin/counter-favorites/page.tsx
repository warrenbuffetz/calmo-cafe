import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { AdminCounterFavoritesEditor } from "@/components/admin/AdminCounterFavoritesEditor";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Counter favorites — Calmo admin",
  robots: { index: false, follow: false },
};

export default function AdminCounterFavoritesPage() {
  return (
    <SiteChrome>
      <AdminShell
        title="Counter favorites"
        description="These four items appear on the paper menu in the From the counter section."
      >
        <AdminCounterFavoritesEditor />
      </AdminShell>
    </SiteChrome>
  );
}
