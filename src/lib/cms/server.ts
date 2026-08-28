import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CmsKey } from "@/lib/cms/types";

export async function getCmsRow<T>(key: CmsKey): Promise<T | null> {
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`[cms] getCmsRow(${key}) failed:`, error);
    return null;
  }

  return (data?.value as T | undefined) ?? null;
}

export async function upsertCmsRow<T>(key: CmsKey, value: T): Promise<void> {
  const { error } = await supabaseAdmin.from("site_content").upsert({
    key,
    value,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidateTag("cms-content");
}

export async function seedCmsDefaults(
  entries: Array<{ key: CmsKey; value: unknown }>,
): Promise<void> {
  for (const entry of entries) {
    const existing = await getCmsRow(entry.key);
    if (existing) continue;
    await upsertCmsRow(entry.key, entry.value);
  }
}
