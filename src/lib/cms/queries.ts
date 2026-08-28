import "server-only";

import { unstable_cache } from "next/cache";
import {
  cmsDefaults,
  defaultCounterFavorites,
  defaultSiteCopy,
} from "@/lib/cms/defaults";
import { getCmsRow } from "@/lib/cms/server";
import { CMS_KEYS } from "@/lib/cms/types";
import type {
  AboutCopyContent,
  CounterFavoritesContent,
  HeroCopyContent,
  SiteCopyContent,
} from "@/lib/cms/types";
import type { VenueHours } from "@/lib/venue";

export function isCmsEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  );
}

async function readCmsValue<T>(key: keyof typeof cmsDefaults, fallback: T): Promise<T> {
  if (!isCmsEnabled()) return fallback;

  try {
    const value = await getCmsRow<T>(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

const getCachedCounterFavorites = unstable_cache(
  async () => readCmsValue(CMS_KEYS.counterFavorites, defaultCounterFavorites),
  ["cms-counter-favorites"],
  { tags: ["cms-content"] },
);

const getCachedHeroCopy = unstable_cache(
  async () => readCmsValue(CMS_KEYS.heroCopy, defaultSiteCopy.hero),
  ["cms-hero-copy"],
  { tags: ["cms-content"] },
);

const getCachedAboutCopy = unstable_cache(
  async () => readCmsValue(CMS_KEYS.aboutCopy, defaultSiteCopy.about),
  ["cms-about-copy"],
  { tags: ["cms-content"] },
);

const getCachedVenueHours = unstable_cache(
  async () => readCmsValue(CMS_KEYS.venueHours, defaultSiteCopy.hours),
  ["cms-venue-hours"],
  { tags: ["cms-content"] },
);

export async function getCounterFavorites(): Promise<CounterFavoritesContent> {
  return getCachedCounterFavorites();
}

export async function getHeroCopy(): Promise<HeroCopyContent> {
  return getCachedHeroCopy();
}

export async function getAboutCopy(): Promise<AboutCopyContent> {
  return getCachedAboutCopy();
}

export async function getVenueHours(): Promise<VenueHours[]> {
  return getCachedVenueHours();
}

export async function getSiteCopy(): Promise<SiteCopyContent> {
  const [hero, about, hours] = await Promise.all([
    getHeroCopy(),
    getAboutCopy(),
    getVenueHours(),
  ]);

  return { hero, about, hours };
}
