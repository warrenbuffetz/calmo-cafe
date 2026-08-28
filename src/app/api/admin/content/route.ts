import { NextResponse } from "next/server";
import { z } from "zod";
import { cmsDefaults } from "@/lib/cms/defaults";
import { getCmsRow, seedCmsDefaults, upsertCmsRow } from "@/lib/cms/server";
import { CMS_KEYS } from "@/lib/cms/types";
import { isAdminAuthenticatedFromRequest } from "@/lib/auth/admin";

const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  section: z.enum(["coffee", "specialty", "pastry"]),
  unclear: z.boolean().optional(),
});

const counterFavoritesSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  items: z.array(menuItemSchema).length(4),
});

const heroCopySchema = z.object({
  neighborhood: z.string().min(1),
  walkInsLabel: z.string().min(1),
  tagline: z.string().min(1),
  subtitle: z.string().min(1),
});

const aboutCopySchema = z.object({
  eyebrow: z.string().min(1),
  headlineLine1: z.string().min(1),
  headlineLine2: z.string().min(1),
  pillars: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .length(4),
});

const venueHoursSchema = z
  .array(
    z.object({
      days: z.string().min(1),
      time: z.string().min(1),
      dayIdx: z.array(z.number().int().min(0).max(6)),
      open: z.string().optional(),
      close: z.string().optional(),
      closed: z.boolean().optional(),
    }),
  )
  .min(1)
  .max(7);

const updateSchema = z.discriminatedUnion("key", [
  z.object({ key: z.literal(CMS_KEYS.counterFavorites), value: counterFavoritesSchema }),
  z.object({ key: z.literal(CMS_KEYS.heroCopy), value: heroCopySchema }),
  z.object({ key: z.literal(CMS_KEYS.aboutCopy), value: aboutCopySchema }),
  z.object({ key: z.literal(CMS_KEYS.venueHours), value: venueHoursSchema }),
]);

async function requireAdmin(request: Request) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const [counterFavorites, heroCopy, aboutCopy, venueHours] = await Promise.all([
    getCmsRow(CMS_KEYS.counterFavorites),
    getCmsRow(CMS_KEYS.heroCopy),
    getCmsRow(CMS_KEYS.aboutCopy),
    getCmsRow(CMS_KEYS.venueHours),
  ]);

  return NextResponse.json({
    counterFavorites: counterFavorites ?? cmsDefaults[CMS_KEYS.counterFavorites],
    heroCopy: heroCopy ?? cmsDefaults[CMS_KEYS.heroCopy],
    aboutCopy: aboutCopy ?? cmsDefaults[CMS_KEYS.aboutCopy],
    venueHours: venueHours ?? cmsDefaults[CMS_KEYS.venueHours],
  });
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid content payload." }, { status: 400 });
    }

    await upsertCmsRow(parsed.data.key, parsed.data.value);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[cms/content] PUT failed:", error);
    return NextResponse.json({ error: "Unable to save content." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    await seedCmsDefaults([
      { key: CMS_KEYS.counterFavorites, value: cmsDefaults[CMS_KEYS.counterFavorites] },
      { key: CMS_KEYS.heroCopy, value: cmsDefaults[CMS_KEYS.heroCopy] },
      { key: CMS_KEYS.aboutCopy, value: cmsDefaults[CMS_KEYS.aboutCopy] },
      { key: CMS_KEYS.venueHours, value: cmsDefaults[CMS_KEYS.venueHours] },
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[cms/content] POST seed failed:", error);
    return NextResponse.json({ error: "Unable to seed content." }, { status: 500 });
  }
}
