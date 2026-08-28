import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSiteCopyEditor } from "@/components/admin/AdminSiteCopyEditor";

export const metadata: Metadata = {
  title: "Site copy — Calmo admin",
  robots: { index: false, follow: false },
};

export default function AdminSiteCopyPage() {
  return (
    <SiteChrome>
      <AdminShell
        title="Hero, about & hours"
        description="Homepage hero text, about section copy, and opening hours."
      >
        <AdminSiteCopyEditor />
      </AdminShell>
    </SiteChrome>
  );
}
