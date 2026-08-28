import Image from "next/image";
import { calmoBlurDataURL } from "@/lib/image";
import { MenuFavoritesFit } from "@/components/MenuFavoritesFit";
import { SketchField } from "@/components/SketchField";
import type { CounterFavoritesContent } from "@/lib/cms/types";
import { menuSectionLabels } from "@/lib/menu";
import { menuSectionSurface, sectionShell } from "@/lib/section";
import { cn } from "@/lib/utils";

type MenuPolaroidProps = {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  tapeRotate?: string;
  priority?: boolean;
  elevated?: boolean;
};

function MenuPolaroid({
  src,
  alt,
  aspect = "aspect-[720/406]",
  className,
  tapeRotate = "-rotate-1",
  priority,
  elevated,
}: MenuPolaroidProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/gallery/gallery-tape-plain.png"
        alt=""
        aria-hidden
        width={883}
        height={294}
        unoptimized
        className={cn(
          "absolute -top-3 left-1/2 z-20 h-auto w-[4.5rem] -translate-x-1/2 drop-shadow-[0_1px_3px_rgba(50,27,15,0.14)] sm:w-[5rem]",
          tapeRotate,
        )}
      />
      <div
        className={cn(
          "overflow-hidden rounded-sm bg-white p-1.5 md:p-2",
          elevated
            ? "shadow-[4px_8px_0_rgba(50,27,15,0.12)]"
            : "shadow-[3px_6px_0_rgba(50,27,15,0.09)]",
        )}
      >
        <div className={cn("relative w-full overflow-hidden bg-calmo-beige/50", aspect)}>
          <Image
            src={src}
            alt={alt}
            fill
            placeholder="blur"
            blurDataURL={calmoBlurDataURL}
            className="object-contain object-center"
            sizes="(min-width: 1024px) 42vw, 90vw"
            priority={priority}
          />
        </div>
      </div>
    </div>
  );
}

function MenuBoardPhotos() {
  return (
    <div className="relative mx-auto w-full max-w-lg pb-10 sm:pb-12 lg:mx-0 lg:max-w-none">
      <MenuPolaroid
        src="/gallery/gallery-menu.jpg"
        alt="Calmo drinks menu with coffee and specialty beverages"
        className="relative z-10 w-[94%] -rotate-2"
        priority
      />
      <MenuPolaroid
        src="/gallery/gallery-menu-baked-goods.jpg"
        alt="Calmo baked goods menu with scones, brownies, tiramisu, and pies"
        aspect="aspect-[881/675]"
        className="relative z-20 -mt-16 ml-auto w-[88%] rotate-[2deg] sm:-mt-20 lg:translate-x-2"
        tapeRotate="rotate-[2deg]"
        elevated
      />
    </div>
  );
}

function MenuHighlights({ counterFavorites }: { counterFavorites: CounterFavoritesContent }) {
  return (
    <div className="relative mx-auto w-full max-w-[24rem] sm:max-w-[26rem] lg:mx-0 lg:-mt-10 lg:max-w-none xl:-mt-12">
      <div className="@container/paper relative aspect-[712/1005] w-full">
        <Image
          src="/gallery/menu-counter-paper.png"
          alt=""
          aria-hidden
          fill
          unoptimized
          className="object-fill"
          sizes="(min-width: 1024px) 42vw, 90vw"
        />
        <div
          id="menu-favorites-content"
          className="absolute inset-0 flex flex-col px-[13%] pb-[40%] pt-[12%] pr-[18%] sm:px-[14%] sm:pb-[38%] sm:pt-[12.5%] sm:pr-[20%]"
        >
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-calmo-red-brown sm:text-[11px]">
            {counterFavorites.title}
          </p>
          <p className="mt-2 max-w-[14rem] font-body text-[12px] leading-snug text-calmo-burnt-brown/70 sm:mt-2.5 sm:text-sm sm:leading-relaxed">
            {counterFavorites.intro}
          </p>
          <ol className="mt-2.5 space-y-0 sm:mt-3.5">
            {counterFavorites.items.map((item, index) => (
              <li
                key={item.name}
                className={cn(
                  "flex gap-2.5 py-2 sm:gap-3.5 sm:py-3",
                  index > 0 && "border-t border-calmo-burnt-brown/12",
                )}
              >
                <span
                  aria-hidden
                  className="w-5 shrink-0 pt-0.5 font-body text-xs tabular-nums text-calmo-burnt-brown/35 sm:text-sm"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-calmo-red-brown/85 sm:text-[10px]">
                    {menuSectionLabels[item.section]}
                  </p>
                  <h3 className="mt-0.5 font-display text-lg leading-snug text-calmo-burnt-brown sm:text-xl">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 font-body text-[11px] leading-snug text-calmo-burnt-brown/65 sm:mt-1 sm:line-clamp-none sm:text-sm sm:leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <MenuFavoritesFit targetId="menu-favorites-content" />
      </div>
    </div>
  );
}

export function MenuPreview({
  counterFavorites,
}: {
  counterFavorites: CounterFavoritesContent;
}) {
  return (
    <section id="menu" className={`${sectionShell} ${menuSectionSurface} relative overflow-x-clip`}>
      <SketchField
        items={[
          {
            src: "/sketch-dish.png",
            width: 1024,
            height: 964,
            className:
              "hidden lg:block -left-20 -top-16 w-[14rem] -rotate-6 opacity-[0.08]",
          },
          {
            src: "/sketch-brunch.png",
            width: 733,
            height: 1024,
            className:
              "hidden lg:block right-[4%] top-[22%] w-[12rem] rotate-6 opacity-[0.07]",
          },
          {
            src: "/sketch-cup.png",
            width: 910,
            height: 1024,
            className:
              "hidden lg:block left-6 top-[40%] w-[12rem] -rotate-6 opacity-[0.15]",
          },
          {
            src: "/sketch-plate.png",
            width: 741,
            height: 1024,
            className:
              "hidden lg:block -right-28 -bottom-32 w-[23rem] opacity-[0.18]",
          },
        ]}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Menu
          </p>
          <h2 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl md:text-5xl">
            From the counter.
          </h2>
        </header>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:items-start lg:gap-14">
          <MenuBoardPhotos />
          <MenuHighlights counterFavorites={counterFavorites} />
        </div>
      </div>
    </section>
  );
}
