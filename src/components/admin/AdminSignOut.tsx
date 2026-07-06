"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AdminSignOut() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/reservations/admin/login");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className="px-5 py-2.5 text-[11px]"
      disabled={signingOut}
      onClick={handleSignOut}
    >
      {signingOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
