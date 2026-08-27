export type VenueHours = {
  days: string;
  time: string;
  dayIdx: number[];
  open?: string;
  close?: string;
  closed?: boolean;
};

export function isOpenHours(entry: VenueHours): entry is VenueHours & { open: string; close: string } {
  return !entry.closed && !!entry.open && !!entry.close;
}

export const venue = {
  category: "Cafe & Dessert Bar",
  neighborhood: "Dundas West, Toronto",
  tagline: "Desserts, coffee & calm.",
  subtitle: "House-made pastries and coffee on Dundas West.",
  description:
    "A neighborhood cafe bar on Dundas West — house desserts, coffee, and specialty drinks.",
  address: {
    line1: "1227 Dundas St W",
    line2: "Toronto, ON M6J 1X6",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=1227+Dundas+St+W,+Toronto,+ON+M6J+1X6",
  },
  hours: [
    { days: "Mon", time: "Closed", dayIdx: [1], closed: true },
    { days: "Tue – Sun", time: "8am – 4pm", dayIdx: [0, 2, 3, 4, 5, 6], open: "08:00", close: "16:00" },
  ] satisfies VenueHours[],
} as const;
