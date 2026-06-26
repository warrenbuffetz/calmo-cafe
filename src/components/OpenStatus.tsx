"use client";

import { useEffect, useState } from "react";
import { venue } from "@/lib/venue";

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function label(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "am" : "pm";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hh}${period}` : `${hh}:${String(m).padStart(2, "0")}${period}`;
}

function torontoNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return { day: WEEKDAY_INDEX[weekday] ?? 0, minutes: hour * 60 + minute };
}

type Status = { open: boolean; text: string };

function computeStatus(): Status {
  const { day, minutes } = torontoNow();

  const today = venue.hours.find((h) => h.dayIdx.includes(day));
  if (today) {
    const opensAt = toMinutes(today.open);
    const closesAt = toMinutes(today.close);
    if (minutes >= opensAt && minutes < closesAt) {
      return { open: true, text: `Open now · until ${label(today.close)}` };
    }
    if (minutes < opensAt) {
      return { open: false, text: `Opens ${label(today.open)} today` };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const nextDay = (day + i) % 7;
    const entry = venue.hours.find((h) => h.dayIdx.includes(nextDay));
    if (entry) {
      return { open: false, text: `Opens ${label(entry.open)} ${DAY_SHORT[nextDay]}` };
    }
  }

  return { open: false, text: "Closed" };
}

export function OpenStatus() {
  // Time-dependent and timezone-aware: compute after mount so server and client
  // first render match (avoids hydration mismatch).
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    setStatus(computeStatus());
  }, []);

  if (!status) return null;

  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-calmo-beige/30 bg-calmo-burnt-brown/25 px-5 py-3.5 font-body text-xs font-medium uppercase tracking-[0.14em] text-calmo-beige backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        {status.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            status.open ? "bg-emerald-400" : "bg-calmo-beige/40"
          }`}
        />
      </span>
      {status.text}
    </span>
  );
}
