"use client";

import { useCallback, useRef, useState } from "react";
import {
  FreshFromCounterCallout,
  GalleryTile,
  type MobileSpreadPage,
} from "@/components/Gallery";
import { cn } from "@/lib/utils";

type GalleryMobileScrapbookProps = {
  pages: MobileSpreadPage[];
};

function MobileSpreadGrid({
  page,
  pageIndex,
}: {
  page: MobileSpreadPage;
  pageIndex: number;
}) {
  const hasNoteAccents = page.cells.some((cell) => cell.kraftNote || cell.ownerNote);

  return (
    <article
      data-scrapbook-page
      className={cn(
        "relative shrink-0 basis-[88%] snap-center snap-always overflow-visible",
        page.freshCallout && "pb-10",
        hasNoteAccents && "pb-12",
      )}
    >
      <div className="grid grid-cols-2 auto-rows-auto pt-4">
        {page.cells.map((cell) => (
          <div
            key={cell.src}
            className={cn("relative -mx-2.5 -mb-2.5 sm:-mx-3 sm:-mb-3", cell.slotClassName)}
          >
            <GalleryTile
              src={cell.src}
              alt={cell.alt}
              aspect={cell.aspect}
              placement="relative block w-full"
              tape={cell.tape}
              tapeRotate={cell.tapeRotate}
              ownerNote={cell.ownerNote}
              kraftNote={cell.kraftNote}
              pushPin={cell.pushPin}
              compact
              compactAccents
              sizes="42vw"
              priority={pageIndex === 0}
            />
          </div>
        ))}
      </div>
      {page.freshCallout ? (
        <FreshFromCounterCallout className="bottom-1 left-0 z-40 translate-y-0 sm:left-1" />
      ) : null}
    </article>
  );
}

export function GalleryMobileScrapbook({ pages }: GalleryMobileScrapbookProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const handleScroll = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;

    const spreadPages = node.querySelectorAll<HTMLElement>("[data-scrapbook-page]");
    if (spreadPages.length === 0) return;

    const center = node.scrollLeft + node.clientWidth / 2;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    spreadPages.forEach((page, index) => {
      const pageCenter = page.offsetLeft + page.offsetWidth / 2;
      const distance = Math.abs(center - pageCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });

    setActivePage(closest);
  }, []);

  return (
    <div className="mt-8 md:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        aria-label="Instagram scrapbook gallery"
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain",
          "px-[6%] pt-6 pb-1",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {pages.map((page, index) => (
          <MobileSpreadGrid key={`spread-${index}`} page={page} pageIndex={index} />
        ))}
        <div aria-hidden className="w-4 shrink-0" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-[6%]">
        <p
          className={cn(
            "font-body text-[10px] font-medium uppercase tracking-[0.22em] text-calmo-blue transition-opacity duration-300",
            activePage === 0 ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={activePage !== 0}
        >
          Swipe for more →
        </p>
        <div className="ml-auto flex items-center gap-1.5" aria-label="Scrapbook pages">
          {pages.map((_, index) => (
            <span
              key={index}
              aria-hidden={index !== activePage}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === activePage ? "w-4 bg-calmo-blue" : "w-1.5 bg-calmo-blue/30",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
