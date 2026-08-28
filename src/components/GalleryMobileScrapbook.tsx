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
  return (
    <article
      data-scrapbook-page
      className="relative shrink-0 basis-[94%] snap-center snap-always"
    >
      <div className="grid grid-cols-2 auto-rows-auto">
        {page.cells.map((cell, cellIndex) => (
          <div
            key={cell.src}
            className={cn(
              "relative -mx-2 sm:-mx-2.5",
              cellIndex < 2 && "pt-6",
              cellIndex < 2 ? "-mb-2 sm:-mb-2.5" : null,
              cellIndex >= 2 && "pb-14",
              cell.kraftNote && "pb-[4.75rem]",
              cell.ownerNote && "pb-16",
              cell.slotClassName,
            )}
          >
            {page.freshCallout && cellIndex === 0 ? (
              <div className="relative pb-[7rem]">
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
                  sizes="46vw"
                  priority={pageIndex === 0}
                />
                <FreshFromCounterCallout flat anchoredBelow />
              </div>
            ) : (
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
                sizes="46vw"
                priority={pageIndex === 0}
              />
            )}
          </div>
        ))}
      </div>
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
          "flex touch-pan-x snap-x snap-mandatory items-start gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain",
          "px-[3%]",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {pages.map((page, index) => (
          <MobileSpreadGrid key={`spread-${index}`} page={page} pageIndex={index} />
        ))}
        <div aria-hidden className="w-3 shrink-0" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-[3%]">
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
