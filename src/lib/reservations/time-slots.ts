import { venue } from "@/lib/venue";

const BOOKING_WINDOW_DAYS = 30;

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getTimeSlotsForDate(dateStr: string): string[] {
  const date = new Date(`${dateStr}T12:00:00`);
  const dayIdx = date.getDay();

  const hoursEntry = venue.hours.find((entry) => entry.dayIdx.includes(dayIdx));
  if (!hoursEntry) return [];

  const openMinutes = parseTimeToMinutes(hoursEntry.open);
  const closeMinutes = parseTimeToMinutes(hoursEntry.close);
  const lastSlotMinutes = closeMinutes - 30;

  const slots: string[] = [];
  for (let m = openMinutes; m <= lastSlotMinutes; m += 30) {
    slots.push(formatMinutesToTime(m));
  }

  return slots;
}

export function getMinBookingDate(): string {
  const today = new Date();
  return formatDateInput(today);
}

export function getMaxBookingDate(): string {
  const max = new Date();
  max.setDate(max.getDate() + BOOKING_WINDOW_DAYS);
  return formatDateInput(max);
}

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateInBookingWindow(dateStr: string): boolean {
  const date = new Date(`${dateStr}T12:00:00`);
  const min = new Date(`${getMinBookingDate()}T00:00:00`);
  const max = new Date(`${getMaxBookingDate()}T23:59:59`);
  return date >= min && date <= max;
}

export function isValidTimeForDate(dateStr: string, time: string): boolean {
  return getTimeSlotsForDate(dateStr).includes(time);
}

export function formatReservationDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatReservationTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatReservationDateShort(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getScheduleWeekDates(weekOffset = 0): string[] {
  const dates: string[] = [];
  const start = new Date();
  start.setDate(start.getDate() + weekOffset * 7);
  const maxDate = new Date(`${getMaxBookingDate()}T23:59:59`);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    if (date > maxDate) break;
    dates.push(formatDateInput(date));
  }

  return dates;
}

export function getWeekStartDate(weekOffset = 0): string {
  const start = new Date();
  start.setDate(start.getDate() + weekOffset * 7);
  return formatDateInput(start);
}

export function getScheduleDateRange(): string[] {
  const dates: string[] = [];
  const start = new Date();
  const maxDate = new Date(`${getMaxBookingDate()}T23:59:59`);
  const cursor = new Date(start);

  while (cursor <= maxDate) {
    dates.push(formatDateInput(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function getFullScheduleRange(): { from: string; to: string } {
  return {
    from: getMinBookingDate(),
    to: getMaxBookingDate(),
  };
}

export function getScheduleRange(weekOffset = 0): { from: string; to: string } {
  const dates = getScheduleWeekDates(weekOffset);
  if (dates.length === 0) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + weekOffset * 7);
    const fallbackStr = formatDateInput(fallback);
    return { from: fallbackStr, to: fallbackStr };
  }
  return { from: dates[0], to: dates[dates.length - 1] };
}

export function canAdvanceScheduleWeek(weekOffset: number): boolean {
  const nextWeekStart = new Date();
  nextWeekStart.setDate(nextWeekStart.getDate() + (weekOffset + 1) * 7);
  const max = new Date(`${getMaxBookingDate()}T23:59:59`);
  return nextWeekStart <= max;
}

export function getMaxScheduleWeekOffset(): number {
  let offset = 0;
  while (canAdvanceScheduleWeek(offset)) {
    offset += 1;
  }
  return offset;
}

function formatScheduleDayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

export function formatScheduleWeekLabel(weekDates: string[], weekOffset: number): string {
  if (weekOffset === 0) {
    return "This week";
  }
  if (weekDates.length === 0) {
    return "";
  }
  const first = formatScheduleDayLabel(weekDates[0]);
  const last = formatScheduleDayLabel(weekDates[weekDates.length - 1]);
  return first === last ? first : `${first} – ${last}`;
}

export function parseScheduleWeekOffset(param: string | null): number {
  const parsed = Number.parseInt(param ?? "0", 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return Math.min(parsed, getMaxScheduleWeekOffset());
}

export function formatRequestedAt(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
