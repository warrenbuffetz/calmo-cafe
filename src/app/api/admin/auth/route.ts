import { NextResponse } from "next/server";
import { adminPinSchema } from "@/lib/reservations/schema";
import { setAdminSessionCookie } from "@/lib/auth/admin";
import { verifyAdminPin } from "@/lib/auth/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminPinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "PIN is required." }, { status: 400 });
    }

    if (!verifyAdminPin(parsed.data.pin)) {
      return NextResponse.json({ error: "Invalid PIN." }, { status: 401 });
    }

    await setAdminSessionCookie();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/auth] POST failed:", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
