"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Textarea } from "@/components/ui/FormField";
import { CMS_KEYS } from "@/lib/cms/types";
import type { AboutCopyContent, HeroCopyContent } from "@/lib/cms/types";
import type { VenueHours } from "@/lib/venue";

const WEEKDAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
] as const;

const emptyHourRow = (): VenueHours => ({
  days: "",
  time: "",
  dayIdx: [],
  open: "08:00",
  close: "16:00",
});

type SiteEditorState = {
  heroCopy: HeroCopyContent;
  aboutCopy: AboutCopyContent;
  venueHours: VenueHours[];
};

export function AdminSiteCopyEditor() {
  const [content, setContent] = useState<SiteEditorState | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        setContent({
          heroCopy: data.heroCopy,
          aboutCopy: data.aboutCopy,
          venueHours: data.venueHours,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load site copy.");
        setLoading(false);
      });
  }, []);

  const saveSection = async (key: string, value: unknown, label: string) => {
    if (!content || savingKey) return;

    setSavingKey(key);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Unable to save.");
        return;
      }

      setMessage(`${label} saved.`);
    } catch {
      setError("Unable to save right now.");
    } finally {
      setSavingKey(null);
    }
  };

  const updateHour = (index: number, field: keyof VenueHours, value: string | boolean | number[]) => {
    if (!content) return;
    const venueHours = [...content.venueHours];
    venueHours[index] = { ...venueHours[index], [field]: value };
    setContent({ ...content, venueHours });
  };

  const toggleHourDay = (rowIndex: number, day: number) => {
    if (!content) return;
    const venueHours = [...content.venueHours];
    const entry = { ...venueHours[rowIndex] };
    const days = new Set(entry.dayIdx);
    if (days.has(day)) days.delete(day);
    else days.add(day);
    entry.dayIdx = [...days].sort((a, b) => a - b);
    venueHours[rowIndex] = entry;
    setContent({ ...content, venueHours });
  };

  const addHourRow = () => {
    if (!content) return;
    setContent({ ...content, venueHours: [...content.venueHours, emptyHourRow()] });
  };

  const removeHourRow = (index: number) => {
    if (!content || content.venueHours.length <= 1) return;
    setContent({
      ...content,
      venueHours: content.venueHours.filter((_, rowIndex) => rowIndex !== index),
    });
  };

  const setDailyHoursTemplate = () => {
    if (!content) return;
    const openRow = content.venueHours.find((entry) => !entry.closed && entry.open && entry.close);
    const open = openRow?.open ?? "08:00";
    const close = openRow?.close ?? "16:00";
    const time = openRow?.time ?? "8am – 4pm";

    setContent({
      ...content,
      venueHours: WEEKDAYS.map(({ label, value }) => ({
        days: label,
        time: value === 1 ? "Closed" : time,
        dayIdx: [value],
        closed: value === 1,
        open: value === 1 ? undefined : open,
        close: value === 1 ? undefined : close,
      })),
    });
  };

  const setClosedHour = (index: number, closed: boolean) => {
    if (!content) return;
    const venueHours = [...content.venueHours];
    venueHours[index] = {
      ...venueHours[index],
      closed,
      open: closed ? undefined : venueHours[index].open ?? "08:00",
      close: closed ? undefined : venueHours[index].close ?? "16:00",
    };
    setContent({ ...content, venueHours });
  };

  if (loading) {
    return <p className="font-body text-sm text-calmo-burnt-brown/70">Loading...</p>;
  }

  if (!content) {
    return <p className="font-body text-sm text-calmo-red-brown">{error ?? "Content unavailable."}</p>;
  }

  return (
    <div className="space-y-12">
      <section className="space-y-6 rounded-2xl border border-calmo-burnt-brown/10 bg-white/30 p-5">
        <h2 className="font-title text-xl font-bold text-calmo-burnt-brown">Hero</h2>

        <FormField label="Neighborhood" htmlFor="hero-neighborhood">
          <Input
            id="hero-neighborhood"
            value={content.heroCopy.neighborhood}
            onChange={(e) =>
              setContent({
                ...content,
                heroCopy: { ...content.heroCopy, neighborhood: e.target.value },
              })
            }
          />
        </FormField>

        <FormField label="Walk-ins label" htmlFor="hero-walk-ins">
          <Input
            id="hero-walk-ins"
            value={content.heroCopy.walkInsLabel}
            onChange={(e) =>
              setContent({
                ...content,
                heroCopy: { ...content.heroCopy, walkInsLabel: e.target.value },
              })
            }
          />
        </FormField>

        <FormField label="Tagline" htmlFor="hero-tagline">
          <Input
            id="hero-tagline"
            value={content.heroCopy.tagline}
            onChange={(e) =>
              setContent({
                ...content,
                heroCopy: { ...content.heroCopy, tagline: e.target.value },
              })
            }
          />
        </FormField>

        <FormField label="Subtitle" htmlFor="hero-subtitle">
          <Textarea
            id="hero-subtitle"
            value={content.heroCopy.subtitle}
            onChange={(e) =>
              setContent({
                ...content,
                heroCopy: { ...content.heroCopy, subtitle: e.target.value },
              })
            }
          />
        </FormField>

        <Button
          type="button"
          variant="dark"
          disabled={savingKey !== null}
          onClick={() => saveSection(CMS_KEYS.heroCopy, content.heroCopy, "Hero copy")}
        >
          {savingKey === CMS_KEYS.heroCopy ? "Saving..." : "Save hero"}
        </Button>
      </section>

      <section className="space-y-6 rounded-2xl border border-calmo-burnt-brown/10 bg-white/30 p-5">
        <h2 className="font-title text-xl font-bold text-calmo-burnt-brown">About</h2>

        <FormField label="Eyebrow" htmlFor="about-eyebrow">
          <Input
            id="about-eyebrow"
            value={content.aboutCopy.eyebrow}
            onChange={(e) =>
              setContent({
                ...content,
                aboutCopy: { ...content.aboutCopy, eyebrow: e.target.value },
              })
            }
          />
        </FormField>

        <FormField label="Headline line 1" htmlFor="about-headline-1">
          <Input
            id="about-headline-1"
            value={content.aboutCopy.headlineLine1}
            onChange={(e) =>
              setContent({
                ...content,
                aboutCopy: { ...content.aboutCopy, headlineLine1: e.target.value },
              })
            }
          />
        </FormField>

        <FormField label="Headline line 2" htmlFor="about-headline-2">
          <Input
            id="about-headline-2"
            value={content.aboutCopy.headlineLine2}
            onChange={(e) =>
              setContent({
                ...content,
                aboutCopy: { ...content.aboutCopy, headlineLine2: e.target.value },
              })
            }
          />
        </FormField>

        <div className="space-y-5">
          {content.aboutCopy.pillars.map((pillar, index) => (
            <div key={index} className="rounded-xl border border-calmo-burnt-brown/8 p-4">
              <p className="font-body text-xs font-medium uppercase tracking-[0.18em] text-calmo-red-brown/80">
                Pillar {index + 1}
              </p>
              <div className="mt-3 space-y-3">
                <FormField label="Title" htmlFor={`pillar-title-${index}`}>
                  <Input
                    id={`pillar-title-${index}`}
                    value={pillar.title}
                    onChange={(e) => {
                      const pillars = [...content.aboutCopy.pillars];
                      pillars[index] = { ...pillars[index], title: e.target.value };
                      setContent({
                        ...content,
                        aboutCopy: { ...content.aboutCopy, pillars },
                      });
                    }}
                  />
                </FormField>
                <FormField label="Description" htmlFor={`pillar-description-${index}`}>
                  <Textarea
                    id={`pillar-description-${index}`}
                    value={pillar.description}
                    onChange={(e) => {
                      const pillars = [...content.aboutCopy.pillars];
                      pillars[index] = { ...pillars[index], description: e.target.value };
                      setContent({
                        ...content,
                        aboutCopy: { ...content.aboutCopy, pillars },
                      });
                    }}
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="dark"
          disabled={savingKey !== null}
          onClick={() => saveSection(CMS_KEYS.aboutCopy, content.aboutCopy, "About copy")}
        >
          {savingKey === CMS_KEYS.aboutCopy ? "Saving..." : "Save about"}
        </Button>
      </section>

      <section className="space-y-6 rounded-2xl border border-calmo-burnt-brown/10 bg-white/30 p-5">
        <h2 className="font-title text-xl font-bold text-calmo-burnt-brown">Hours</h2>
        <p className="font-body text-sm text-calmo-burnt-brown/70">
          Each row is one line in the footer. Use a few combined rows (e.g. Mon / Tue – Sun) or
          expand to one row per day. Day checkboxes control the hero open-status badge.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={addHourRow}>
            Add hours row
          </Button>
          <Button type="button" variant="secondary" onClick={setDailyHoursTemplate}>
            Expand to 7 days
          </Button>
        </div>

        {content.venueHours.map((entry, index) => (
          <div key={`hours-row-${index}`} className="rounded-xl border border-calmo-burnt-brown/8 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-body text-xs font-medium uppercase tracking-[0.18em] text-calmo-red-brown/80">
                Row {index + 1}
              </p>
              {content.venueHours.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeHourRow(index)}
                  className="font-body text-xs text-calmo-red-brown/80 underline-offset-2 hover:underline"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Days label" htmlFor={`hours-days-${index}`}>
                <Input
                  id={`hours-days-${index}`}
                  value={entry.days}
                  placeholder="Mon"
                  onChange={(e) => updateHour(index, "days", e.target.value)}
                />
              </FormField>
              <FormField label="Display time" htmlFor={`hours-time-${index}`}>
                <Input
                  id={`hours-time-${index}`}
                  value={entry.time}
                  placeholder="8am – 4pm"
                  onChange={(e) => updateHour(index, "time", e.target.value)}
                />
              </FormField>
              <FormField label="Opens (24h)" htmlFor={`hours-open-${index}`}>
                <Input
                  id={`hours-open-${index}`}
                  value={entry.open ?? ""}
                  placeholder="08:00"
                  disabled={entry.closed}
                  onChange={(e) => updateHour(index, "open", e.target.value)}
                />
              </FormField>
              <FormField label="Closes (24h)" htmlFor={`hours-close-${index}`}>
                <Input
                  id={`hours-close-${index}`}
                  value={entry.close ?? ""}
                  placeholder="16:00"
                  disabled={entry.closed}
                  onChange={(e) => updateHour(index, "close", e.target.value)}
                />
              </FormField>
            </div>

            <div className="mt-4">
              <p className="mb-2 font-body text-xs font-medium uppercase tracking-[0.18em] text-calmo-burnt-brown/70">
                Applies to (open-status)
              </p>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map(({ label, value }) => {
                  const selected = entry.dayIdx.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleHourDay(index, value)}
                      className={
                        selected
                          ? "rounded-full bg-calmo-blue px-3 py-1 font-body text-xs font-medium text-calmo-burnt-brown"
                          : "rounded-full border border-calmo-burnt-brown/15 px-3 py-1 font-body text-xs text-calmo-burnt-brown/70"
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="mt-4 flex items-center gap-2 font-body text-sm text-calmo-burnt-brown/80">
              <input
                type="checkbox"
                checked={Boolean(entry.closed)}
                onChange={(e) => setClosedHour(index, e.target.checked)}
              />
              Closed on these days
            </label>
          </div>
        ))}

        <Button
          type="button"
          variant="dark"
          disabled={savingKey !== null}
          onClick={() => saveSection(CMS_KEYS.venueHours, content.venueHours, "Hours")}
        >
          {savingKey === CMS_KEYS.venueHours ? "Saving..." : "Save hours"}
        </Button>
      </section>

      {error ? <p className="font-body text-sm text-calmo-red-brown">{error}</p> : null}
      {message ? <p className="font-body text-sm text-calmo-burnt-brown/80">{message}</p> : null}
    </div>
  );
}
