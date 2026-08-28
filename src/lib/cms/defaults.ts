import {
  menuHighlightsIntro,
  menuHighlightsTitle,
  previewMenuItems,
} from "@/lib/menu";
import type { VenueHours } from "@/lib/venue";
import { venue } from "@/lib/venue";
import { CMS_KEYS } from "@/lib/cms/types";
import type {
  AboutCopyContent,
  CounterFavoritesContent,
  HeroCopyContent,
  SiteCopyContent,
} from "@/lib/cms/types";

export const defaultCounterFavorites: CounterFavoritesContent = {
  title: menuHighlightsTitle,
  intro: menuHighlightsIntro,
  items: previewMenuItems,
};

export const defaultHeroCopy: HeroCopyContent = {
  neighborhood: venue.neighborhood,
  walkInsLabel: "Walk-ins only",
  tagline: venue.tagline,
  subtitle: venue.subtitle,
};

export const defaultAboutCopy: AboutCopyContent = {
  eyebrow: "About Calmo",
  headlineLine1: "Not just a cafe bar.",
  headlineLine2: "A corner of the neighborhood.",
  pillars: [
    {
      title: "Rooted here",
      description: "A neighborhood cafe bar on Dundas West — familiar faces and open doors.",
    },
    {
      title: "Made for people",
      description: "A place to slow down, catch up, and stay awhile.",
    },
    {
      title: "Made with care",
      description: "House-made desserts and coffee, baked and poured with intention.",
    },
    {
      title: "Made to be simple",
      description: "Pastry and coffee, kept simple.",
    },
  ],
};

export const defaultVenueHours: VenueHours[] = [...venue.hours];

export const defaultSiteCopy: SiteCopyContent = {
  hero: defaultHeroCopy,
  about: defaultAboutCopy,
  hours: defaultVenueHours,
};

export const cmsDefaults = {
  [CMS_KEYS.counterFavorites]: defaultCounterFavorites,
  [CMS_KEYS.heroCopy]: defaultHeroCopy,
  [CMS_KEYS.aboutCopy]: defaultAboutCopy,
  [CMS_KEYS.venueHours]: defaultVenueHours,
} as const;
