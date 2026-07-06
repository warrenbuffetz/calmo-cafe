import { z } from "zod";

export const createReservationSchema = z.object({
  customer_name: z.string().trim().min(1, "Name is required").max(120),
  customer_email: z.string().trim().email("Valid email is required").max(254),
  customer_phone: z.string().trim().min(7, "Phone number is required").max(30),
  party_size: z.coerce.number().int().min(1).max(10),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid date is required"),
  reservation_time: z.string().regex(/^\d{2}:\d{2}$/, "Valid time is required"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const adminPinSchema = z.object({
  pin: z.string().min(1, "PIN is required"),
});

export const adminActionSchema = z.object({
  action: z.enum(["confirm", "cancel", "complete", "no_show"]),
});
