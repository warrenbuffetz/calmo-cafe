"use client";

import {
  menuDisclaimer,
  menuSectionLabels,
  menuSectionOrder,
  type MenuItem,
  type MenuSection,
} from "@/lib/menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type MenuFilter = "all" | MenuSection;

const ACCORDION_TRANSITION_MS = 300;

const sectionPillStyles: Record<MenuSection, { active: string; cardHover: string }> = {
  coffee: {
    active: "bg-calmo-red-brown/12 text-calmo-red-brown shadow-sm ring-1 ring-calmo-red-brown/15",
    cardHover: "hover:border-calmo-blue/50",
  },
  specialty: {
    active: "bg-calmo-blue/35 text-calmo-burnt-brown shadow-sm ring-1 ring-calmo-blue/40",
    cardHover: "hover:border-calmo-blue",
  },
  pastry: {
    active: "bg-calmo-beige text-calmo-burnt-brown shadow-sm ring-1 ring-calmo-burnt-brown/15",
    cardHover: "hover:border-calmo-red-brown/30",
  },
};

const allPillActive =
  "bg-calmo-burnt-brown/10 text-calmo-burnt-brown shadow-sm ring-1 ring-calmo-burnt-brown/15";

const sectionBadgeStyles: Record<MenuSection, string> = {
  coffee: "bg-calmo-red-brown/12 text-calmo-red-brown",
  specialty: "bg-calmo-blue/35 text-calmo-burnt-brown",
  pastry: "bg-calmo-beige text-calmo-burnt-brown ring-1 ring-calmo-burnt-brown/10",
};

const filterOptions: { value: MenuFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...menuSectionOrder.map((section) => ({
    value: section as MenuFilter,
    label: menuSectionLabels[section],
  })),
];

export type { MenuItem };

type MenuItemCardProps = {
  item: MenuItem;
  variant?: "featured" | "menu";
  activeSection?: MenuSection;
};

export function MenuItemCard({ item, variant = "menu", activeSection }: MenuItemCardProps) {
  const section = activeSection ?? item.section;
  const cardHover = sectionPillStyles[section].cardHover;

  return (
    <article
      className={cn(
        "group rounded-2xl border bg-calmo-beige/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-8",
        item.unclear
          ? "border-dashed border-calmo-red-brown/35 hover:border-calmo-red-brown/50 hover:shadow-calmo-red-brown/10"
          : "border-calmo-burnt-brown/10 hover:border-calmo-blue/40 hover:shadow-calmo-blue/15",
        cardHover,
      )}
    >
      {(variant === "featured" || item.unclear) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          {variant === "featured" && (
            <span
              className={cn(
                "inline-block rounded-full px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em]",
                sectionBadgeStyles[item.section],
              )}
            >
              {menuSectionLabels[item.section]}
            </span>
          )}
          {item.unclear && (
            <span className="rounded-full bg-calmo-red-brown/10 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-calmo-red-brown">
              Unclear from photo
            </span>
          )}
        </div>
      )}

      <h3 className="font-display text-2xl leading-snug text-calmo-burnt-brown sm:text-[1.65rem]">
        {item.name}
      </h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-calmo-burnt-brown/65 sm:text-base">
        {item.description}
      </p>
    </article>
  );
}

function MenuItemGrid({
  items,
  activeSection,
}: {
  items: MenuItem[];
  activeSection?: MenuSection;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
      {items.map((item) => (
        <MenuItemCard
          key={item.name}
          item={item}
          variant="menu"
          activeSection={activeSection ?? item.section}
        />
      ))}
    </div>
  );
}

function GroupedMenu({ itemsBySection }: { itemsBySection: Record<MenuSection, MenuItem[]> }) {
  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      {menuSectionOrder.map((section) => (
        <div key={section}>
          <p className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-calmo-burnt-brown/45">
            {menuSectionLabels[section]}
          </p>
          <MenuItemGrid items={itemsBySection[section]} activeSection={section} />
        </div>
      ))}
    </div>
  );
}

type MenuBrowseProps = {
  items: MenuItem[];
};

export function MenuBrowse({ items }: MenuBrowseProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<MenuFilter>("all");
  const panelId = useId();
  const baseId = useId();
  const menuStartRef = useRef<HTMLDivElement>(null);
  const menuEndRef = useRef<HTMLDivElement>(null);
  const filterEndRef = useRef<HTMLDivElement>(null);

  const itemsBySection = menuSectionOrder.reduce(
    (acc, section) => {
      acc[section] = items.filter((item) => item.section === section);
      return acc;
    },
    {} as Record<MenuSection, MenuItem[]>,
  );

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

  const handleFilterChange = (value: MenuFilter) => {
    setFilter(value);
  };

  useEffect(() => {
    if (!open || filter === "all") return;

    const timeout = window.setTimeout(() => {
      filterEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, ACCORDION_TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [filter, open]);

  return (
    <div className="flex flex-col items-center gap-5 lg:gap-6">
      <div
        id={panelId}
        aria-hidden={!open}
        className={cn(
          "w-full transition-all duration-300 ease-out",
          open ? "max-h-[12000px] overflow-visible opacity-100" : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        <div ref={menuStartRef} className="scroll-mt-28 pt-1">
          <div
            role="tablist"
            aria-label="Filter menu by category"
            className="flex w-full flex-wrap gap-1 rounded-full bg-calmo-beige/50 p-1 ring-1 ring-calmo-burnt-brown/10 sm:inline-flex sm:w-auto"
          >
            {filterOptions.map(({ value, label }) => {
              const isActive = filter === value;
              const tabId = `${baseId}-tab-${value}`;
              const filterPanelId = `${baseId}-panel-${value}`;

              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  id={tabId}
                  aria-selected={isActive}
                  aria-controls={filterPanelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleFilterChange(value)}
                  className={cn(
                    "rounded-full px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 sm:px-6",
                    isActive
                      ? value === "all"
                        ? allPillActive
                        : sectionPillStyles[value].active
                      : "text-calmo-burnt-brown/55 hover:bg-calmo-beige/80 hover:text-calmo-burnt-brown",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {open && (
            <div className="mt-6 lg:mt-8">
              <div
                role="tabpanel"
                id={`${baseId}-panel-${filter}`}
                aria-labelledby={`${baseId}-tab-${filter}`}
              >
                {filter === "all" ? (
                  <GroupedMenu itemsBySection={itemsBySection} />
                ) : (
                  <MenuItemGrid items={itemsBySection[filter]} activeSection={filter} />
                )}
                <p className="mt-6 text-center font-accent text-sm italic text-calmo-burnt-brown/50 lg:mt-8">
                  {menuDisclaimer}
                </p>
              </div>
              <div ref={filterEndRef} aria-hidden className="h-0 w-full scroll-mt-24" />
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleToggle}
        className="inline-flex items-center gap-2 rounded-full bg-calmo-burnt-brown px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.14em] text-calmo-beige transition-all hover:bg-calmo-blue hover:text-calmo-burnt-brown hover:shadow-lg hover:shadow-calmo-blue/25"
      >
        Browse the menu
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
          strokeWidth={1.75}
        />
      </button>

      <div ref={menuEndRef} aria-hidden className="h-0 w-full scroll-mt-24" />
    </div>
  );
}
