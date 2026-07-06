"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminReservationTable } from "@/components/admin/AdminReservationTable";
import { AdminScheduleView } from "@/components/admin/AdminScheduleView";
import { cn } from "@/lib/utils";

type AdminView = "inbox" | "schedule";

const VIEW_TABS: { id: AdminView; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "schedule", label: "Schedule" },
];

function AdminReservationsPanelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const initialView: AdminView = viewParam === "schedule" ? "schedule" : "inbox";
  const [view, setView] = useState<AdminView>(initialView);

  useEffect(() => {
    setView(viewParam === "schedule" ? "schedule" : "inbox");
  }, [viewParam]);

  const setAdminView = useCallback(
    (nextView: AdminView) => {
      setView(nextView);
      const params = new URLSearchParams(searchParams.toString());
      if (nextView === "schedule") {
        params.set("view", "schedule");
      } else {
        params.delete("view");
      }
      const query = params.toString();
      router.replace(query ? `/reservations/admin?${query}` : "/reservations/admin", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {VIEW_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAdminView(id)}
            className={cn(
              "inline-flex items-center rounded-full px-5 py-2.5 font-body text-xs font-medium uppercase tracking-[0.12em] transition-all",
              view === id
                ? "bg-calmo-burnt-brown text-calmo-beige"
                : "bg-calmo-beige/60 text-calmo-burnt-brown/70 hover:bg-calmo-blue/25 hover:text-calmo-burnt-brown",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "inbox" ? <AdminReservationTable /> : <AdminScheduleView />}
    </div>
  );
}

export function AdminReservationsPanel() {
  return (
    <Suspense
      fallback={
        <p className="font-body text-sm text-calmo-burnt-brown/60">Loading reservations...</p>
      }
    >
      <AdminReservationsPanelContent />
    </Suspense>
  );
}
