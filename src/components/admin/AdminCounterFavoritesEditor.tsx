"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { CMS_KEYS } from "@/lib/cms/types";
import type { CounterFavoritesContent } from "@/lib/cms/types";
import type { MenuSection } from "@/lib/menu";
import { menuSectionLabels } from "@/lib/menu";

const sections: MenuSection[] = ["coffee", "specialty", "pastry"];

export function AdminCounterFavoritesEditor() {
  const [content, setContent] = useState<CounterFavoritesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data.counterFavorites);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load counter favorites.");
        setLoading(false);
      });
  }, []);

  const updateItem = (
    index: number,
    field: "name" | "description" | "section",
    value: string,
  ) => {
    if (!content) return;
    const items = [...content.items];
    items[index] = { ...items[index], [field]: value };
    setContent({ ...content, items });
  };

  const handleSave = async () => {
    if (!content || saving) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: CMS_KEYS.counterFavorites, value: content }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Unable to save.");
        return;
      }

      setMessage("Saved. Changes are live on the homepage.");
    } catch {
      setError("Unable to save right now.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="font-body text-sm text-calmo-burnt-brown/70">Loading...</p>;
  }

  if (!content) {
    return <p className="font-body text-sm text-calmo-red-brown">{error ?? "Content unavailable."}</p>;
  }

  return (
    <div className="space-y-8">
      <FormField label="Section title" htmlFor="favorites-title">
        <Input
          id="favorites-title"
          value={content.title}
          onChange={(e) => setContent({ ...content, title: e.target.value })}
        />
      </FormField>

      <FormField label="Intro copy" htmlFor="favorites-intro">
        <Textarea
          id="favorites-intro"
          value={content.intro}
          onChange={(e) => setContent({ ...content, intro: e.target.value })}
        />
      </FormField>

      <div className="space-y-6">
        {content.items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-calmo-burnt-brown/10 bg-white/30 p-5"
          >
            <p className="font-body text-xs font-medium uppercase tracking-[0.18em] text-calmo-red-brown/80">
              Item {String(index + 1).padStart(2, "0")}
            </p>

            <div className="mt-4 space-y-4">
              <FormField label="Category" htmlFor={`item-section-${index}`}>
                <Select
                  id={`item-section-${index}`}
                  value={item.section}
                  onChange={(e) => updateItem(index, "section", e.target.value)}
                >
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {menuSectionLabels[section]}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Name" htmlFor={`item-name-${index}`}>
                <Input
                  id={`item-name-${index}`}
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
              </FormField>

              <FormField label="Description" htmlFor={`item-description-${index}`}>
                <Textarea
                  id={`item-description-${index}`}
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      {error ? <p className="font-body text-sm text-calmo-red-brown">{error}</p> : null}
      {message ? <p className="font-body text-sm text-calmo-burnt-brown/80">{message}</p> : null}

      <Button type="button" variant="dark" disabled={saving} onClick={handleSave}>
        {saving ? "Saving..." : "Save counter favorites"}
      </Button>
    </div>
  );
}
