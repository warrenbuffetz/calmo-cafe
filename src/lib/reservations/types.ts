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

export type AdminStatusTab = "pending" | "confirmed" | "cancelled" | "past" | "all";

export const ADMIN_STATUS_TABS: { id: AdminStatusTab; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "past", label: "Past" },
  { id: "all", label: "All" },
];

export type ReservationCounts = {
  pending: number;
  confirmed: number;
};

export const RESERVATION_ACTOR_TYPES = ["staff", "customer", "system"] as const;
export type ReservationActorType = (typeof RESERVATION_ACTOR_TYPES)[number];

export const STAFF_RESERVATION_EVENT_ACTIONS = [
  "confirm",
  "cancel",
  "complete",
  "no_show",
] as const;
export type StaffReservationEventAction = (typeof STAFF_RESERVATION_EVENT_ACTIONS)[number];

/** @deprecated Customer events are not logged; kept for existing DB enum values */
export const RESERVATION_EVENT_ACTIONS = [
  ...STAFF_RESERVATION_EVENT_ACTIONS,
  "created",
  "customer_cancel",
] as const;
export type ReservationEventAction = (typeof RESERVATION_EVENT_ACTIONS)[number];

export type ReservationEvent = {
  id: string;
  reservation_id: string;
  action: StaffReservationEventAction;
  from_status: ReservationStatus | null;
  to_status: ReservationStatus;
  actor_type: "staff";
  actor_id: string | null;
  created_at: string;
};
