import type { ReservationStatus } from "@/lib/reservations/types";

export const statusBadgeStyles: Record<ReservationStatus, string> = {
  pending: "bg-calmo-blue/35 text-calmo-burnt-brown",
  confirmed: "bg-calmo-blue/50 text-calmo-burnt-brown",
  cancelled_by_customer: "bg-calmo-red-brown/12 text-calmo-red-brown",
  cancelled_by_restaurant: "bg-calmo-red-brown/12 text-calmo-red-brown",
  completed: "bg-calmo-burnt-brown/10 text-calmo-burnt-brown",
  no_show: "bg-calmo-burnt-brown/10 text-calmo-burnt-brown",
};

export type ReservationAction = "confirm" | "cancel" | "complete" | "no_show";
