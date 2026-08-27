import Image from "next/image";
import {
  menuDisclaimer,
  menuHighlightsIntro,
  menuHighlightsTitle,
  menuSectionLabels,
  previewMenuItems,
} from "@/lib/menu";
import { sectionShell, sectionSurfaceTint } from "@/lib/section";
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
        <div className={cn("relative w-full overflow-hidden bg-calmo-beige/30", aspect)}>
          <Image
            src={src}
            alt={alt}
            fill
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

function MenuHighlights() {
  return (
    <div className="flex flex-col justify-center">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-calmo-burnt-brown/45">
        {menuHighlightsTitle}
      </p>
      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-calmo-burnt-brown/65">
        {menuHighlightsIntro}
      </p>
      <ul className="mt-5 divide-y divide-calmo-burnt-brown/10">
        {previewMenuItems.map((item) => (
          <li key={item.name} className="py-4 first:pt-0 last:pb-0">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-calmo-red-brown/80">
              {menuSectionLabels[item.section]}
            </p>
            <h3 className="mt-1 font-display text-xl leading-snug text-calmo-burnt-brown sm:text-[1.35rem]">
              {item.name}
            </h3>
            <p className="mt-1.5 font-body text-sm leading-relaxed text-calmo-burnt-brown/65">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-accent text-sm italic leading-relaxed text-calmo-burnt-brown/55">
        {menuDisclaimer}
      </p>
    </div>
  );
}

export function MenuPreview() {
  return (
    <section id="menu" className={`${sectionShell} ${sectionSurfaceTint} relative overflow-x-clip`}>
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Menu
          </p>
          <h2 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl md:text-5xl">
            Dessert, coffee & counter.
          </h2>
        </header>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:items-start lg:gap-14">
          <MenuBoardPhotos />
          <MenuHighlights />
        </div>
      </div>
    </section>
  );
}
