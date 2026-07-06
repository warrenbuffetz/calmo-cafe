import "server-only";

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-cookie";

export { ADMIN_COOKIE_NAME } from "@/lib/auth/admin-cookie";

export function getAdminPin(): string {
  const pin = process.env.ADMIN_PIN;
  if (!pin) {
    throw new Error("ADMIN_PIN is not configured");
  }
  return pin;
}

export function verifyAdminPin(pin: string): boolean {
  try {
    const expected = getAdminPin();
    const pinBuf = Buffer.from(pin);
    const expectedBuf = Buffer.from(expected);

    if (pinBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(pinBuf, expectedBuf);
  } catch {
    return false;
  }
}

export async function setAdminSessionCookie(): Promise<void> {
  const token = await createAdminSessionToken(getAdminPin());
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    return verifyAdminSessionToken(getAdminPin(), token);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticatedFromRequest(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));

  if (!match) return false;

  const token = match.slice(ADMIN_COOKIE_NAME.length + 1);

  try {
    return verifyAdminSessionToken(getAdminPin(), token);
  } catch {
    return false;
  }
}
