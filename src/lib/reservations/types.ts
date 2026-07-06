export const RESERVATION_STATUSES = [
  "pending",
  "confirmed",
  "cancelled_by_customer",
  "cancelled_by_restaurant",
  "completed",
  "no_show",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export type Reservation = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  notes: string | null;
  status: ReservationStatus;
  cancellation_token: string;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
};

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled_by_customer: "Cancelled (guest)",
  cancelled_by_restaurant: "Cancelled (restaurant)",
  completed: "Completed",
  no_show: "No-show",
};

export const ACTIVE_STATUSES: ReservationStatus[] = ["pending", "confirmed"];

export const CANCELLED_STATUSES: ReservationStatus[] = [
  "cancelled_by_customer",
  "cancelled_by_restaurant",
];
