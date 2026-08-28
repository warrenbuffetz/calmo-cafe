import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-cookie";
import { isReservationsEnabled } from "@/lib/features";

const SITE_ADMIN_PREFIX = "/admin";
const RESERVATION_ADMIN_PREFIX = "/reservations/admin";
const PUBLIC_ADMIN_PATHS = [`${SITE_ADMIN_PREFIX}/login`, `${RESERVATION_ADMIN_PREFIX}/login`];

const RESERVATION_PATH_PREFIXES = [
  "/reservations",
  "/api/reservations",
  "/api/admin/reservations",
];

const CMS_ADMIN_API_PREFIXES = ["/api/admin/auth", "/api/admin/content"];

function isReservationPath(pathname: string): boolean {
  return RESERVATION_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isCmsAdminApiPath(pathname: string): boolean {
  return CMS_ADMIN_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isProtectedAdminPath(pathname: string): boolean {
  return (
    pathname.startsWith(SITE_ADMIN_PREFIX) || pathname.startsWith(RESERVATION_ADMIN_PREFIX)
  );
}

async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  const pin = process.env.ADMIN_PIN;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!pin || !token) return false;
  return verifyAdminSessionToken(pin, token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isCmsAdminApiPath(pathname)) {
    return NextResponse.next();
  }

  if (!isReservationsEnabled() && isReservationPath(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!(await verifyAdminSession(request))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = pathname.startsWith(RESERVATION_ADMIN_PREFIX)
      ? `${RESERVATION_ADMIN_PREFIX}/login`
      : `${SITE_ADMIN_PREFIX}/login`;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/reservations/:path*",
    "/api/reservations/:path*",
    "/api/admin/reservations/:path*",
    "/api/admin/auth",
    "/api/admin/content",
  ],
};
