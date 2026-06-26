export type VenueHours = {
  days: string;
  time: string;
  dayIdx: number[];
  open: string;
  close: string;
};

export const venue = {
  category: "Brunch & Coffee",
  neighborhood: "Dundas West, Toronto",
  address: {
    line1: "1227 Dundas St W",
    line2: "Toronto, ON M6J 1X6",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=1227+Dundas+St+W,+Toronto,+ON+M6J+1X6",
  },
  hours: [
    { days: "Mon – Thu", time: "7am – 4pm", dayIdx: [1, 2, 3, 4], open: "07:00", close: "16:00" },
    { days: "Fri – Sat", time: "7am – 8pm", dayIdx: [5, 6], open: "07:00", close: "20:00" },
    { days: "Sun", time: "8am – 4pm", dayIdx: [0], open: "08:00", close: "16:00" },
  ] satisfies VenueHours[],
} as const;
