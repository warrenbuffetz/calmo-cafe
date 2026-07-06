import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-cookie";

const PUBLIC_ADMIN_PATHS = ["/admin/reservations/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const pin = process.env.ADMIN_PIN;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!pin || !token || !(await verifyAdminSessionToken(pin, token))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/reservations/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
