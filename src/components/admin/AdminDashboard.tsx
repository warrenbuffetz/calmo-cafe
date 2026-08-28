"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const links = [
  {
    href: "/admin/counter-favorites",
    title: "Counter favorites",
    description: "Edit the four featured items on the menu paper.",
  },
  {
    href: "/admin/site",
    title: "Hero, about & hours",
    description: "Update homepage copy and opening hours.",
  },
] as const;

export function AdminDashboard() {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    if (seeding) return;

    setSeeding(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/content", { method: "POST" });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Unable to seed content.");
        return;
      }
      setMessage("Defaults imported for any missing sections.");
    } catch {
      setError("Unable to seed content right now.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-calmo-burnt-brown/10 bg-white/30 p-5 transition-colors hover:border-calmo-blue/40"
          >
            <h2 className="font-title text-lg font-bold text-calmo-burnt-brown">{link.title}</h2>
            <p className="mt-2 font-body text-sm text-calmo-burnt-brown/70">{link.description}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-calmo-burnt-brown/15 p-5">
        <p className="font-body text-sm text-calmo-burnt-brown/70">
          First time setup? Import the current static site copy into Supabase without overwriting
          existing edits.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          disabled={seeding}
          onClick={handleSeed}
        >
          {seeding ? "Importing..." : "Seed missing defaults"}
        </Button>
        {error ? <p className="mt-3 font-body text-sm text-calmo-red-brown">{error}</p> : null}
        {message ? <p className="mt-3 font-body text-sm text-calmo-burnt-brown/80">{message}</p> : null}
      </div>
    </div>
  );
}
