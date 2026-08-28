import type { MenuItem, MenuSection } from "@/lib/menu";
import type { VenueHours } from "@/lib/venue";

export const CMS_KEYS = {
  counterFavorites: "counter_favorites",
  heroCopy: "hero_copy",
  aboutCopy: "about_copy",
  venueHours: "venue_hours",
} as const;

export type CmsKey = (typeof CMS_KEYS)[keyof typeof CMS_KEYS];

export type CounterFavoritesContent = {
  title: string;
  intro: string;
  items: MenuItem[];
};

export type HeroCopyContent = {
  neighborhood: string;
  walkInsLabel: string;
  tagline: string;
  subtitle: string;
};

export type AboutPillarCopy = {
  title: string;
  description: string;
};

export type AboutCopyContent = {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  pillars: AboutPillarCopy[];
};

export type SiteCopyContent = {
  hero: HeroCopyContent;
  about: AboutCopyContent;
  hours: VenueHours[];
};

export type MenuSectionOption = MenuSection;
