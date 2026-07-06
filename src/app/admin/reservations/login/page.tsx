import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { sectionShell } from "@/lib/section";

export const metadata: Metadata = {
  title: "Admin login — Calmo",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <SiteChrome>
      <section className={sectionShell}>
        <div className="mx-auto max-w-sm">
          <h1 className="font-title text-3xl font-bold text-calmo-burnt-brown">Staff login</h1>
          <p className="mt-3 font-body text-sm text-calmo-burnt-brown/70">
            Enter your PIN to manage reservations.
          </p>
          <div className="mt-8">
            <Suspense fallback={<p className="font-body text-sm">Loading...</p>}>
              <AdminLoginForm />
            </Suspense>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
