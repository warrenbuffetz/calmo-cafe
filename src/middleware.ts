import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-cookie";
import { isReservationsEnabled } from "@/lib/features";

const ADMIN_PREFIX = "/reservations/admin";
const PUBLIC_ADMIN_PATHS = [`${ADMIN_PREFIX}/login`];

const RESERVATION_PATH_PREFIXES = [
  "/reservations",
  "/api/reservations",
  "/api/admin/reservations",
  "/api/admin/auth",
];

function isReservationPath(pathname: string): boolean {
  return RESERVATION_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isReservationsEnabled() && isReservationPath(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const pin = process.env.ADMIN_PIN;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!pin || !token || !(await verifyAdminSessionToken(pin, token))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `${ADMIN_PREFIX}/login`;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/reservations/:path*",
    "/api/reservations/:path*",
    "/api/admin/reservations/:path*",
    "/api/admin/auth",
  ],
};
