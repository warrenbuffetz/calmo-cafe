"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";

export type MenuItem = {
  name: string;
  description: string;
  category: "diner" | "cafe";
  tag?: string;
};

const categoryStyles = {
  diner: {
    badge: "bg-calmo-red-brown/12 text-calmo-red-brown",
    accent: "group-hover:border-calmo-blue/50",
  },
  cafe: {
    badge: "bg-calmo-blue/35 text-calmo-burnt-brown",
    accent: "group-hover:border-calmo-blue",
  },
};

export function MenuItemCard({ item }: { item: MenuItem }) {
  const styles = categoryStyles[item.category];

  return (
    <article
      className={cn(
        "group rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-calmo-blue/40 hover:shadow-md hover:shadow-calmo-blue/15 sm:p-8",
        styles.accent,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em]",
            styles.badge,
          )}
        >
          {item.category === "diner" ? "Diner" : "Café"}
        </span>
        {item.tag && (
          <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-calmo-burnt-brown/40">
            {item.tag}
          </span>
        )}
      </div>

      <h3 className="font-display text-2xl leading-snug text-calmo-burnt-brown sm:text-[1.65rem]">
        {item.name}
      </h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-calmo-burnt-brown/65 sm:text-base">
        {item.description}
      </p>
    </article>
  );
}

type MenuFullAccordionProps = {
  items: MenuItem[];
};

const ACCORDION_TRANSITION_MS = 300;

export function MenuFullAccordion({ items }: MenuFullAccordionProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const menuStartRef = useRef<HTMLDivElement>(null);
  const menuEndRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prev) => {
      if (prev) {
        window.setTimeout(() => {
          menuEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, ACCORDION_TRANSITION_MS);
      } else {
        window.setTimeout(() => {
          menuStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, ACCORDION_TRANSITION_MS);
      }

      return !prev;
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 lg:gap-6">
      <div
        id={panelId}
        aria-hidden={!open}
        className={cn(
          "w-full transition-all duration-300 ease-out",
          open ? "max-h-[8000px] overflow-visible opacity-100" : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        <div ref={menuStartRef} className="scroll-mt-28 grid gap-5 pt-1 pb-2 sm:grid-cols-2 lg:gap-6">
          {items.map((item) => (
            <MenuItemCard key={item.name} item={item} />
          ))}
        </div>
        <p className="mt-5 text-center font-accent text-sm italic text-calmo-burnt-brown/50 lg:mt-6">
          Pastries change daily — visit us to see what&apos;s fresh.
        </p>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleToggle}
        className="inline-flex items-center gap-2 rounded-full bg-calmo-burnt-brown px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.14em] text-calmo-beige transition-all hover:bg-calmo-blue hover:text-calmo-burnt-brown hover:shadow-lg hover:shadow-calmo-blue/25"
      >
        See Full Menu
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
          strokeWidth={1.75}
        />
      </button>

      <div ref={menuEndRef} aria-hidden className="h-0 w-full scroll-mt-24" />
    </div>
  );
}
