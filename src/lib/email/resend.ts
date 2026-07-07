import "server-only";

import { Resend } from "resend";

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function getFromEmail(): string {
  return process.env.RESERVATION_FROM_EMAIL ?? "onboarding@resend.dev";
}

export function getStaffEmail(): string {
  return process.env.STAFF_NOTIFICATION_EMAIL ?? "hello@calmo.ca";
}

export function getAppBaseUrl(): string {
  const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
  return base.replace(/\/+$/, "");
}
