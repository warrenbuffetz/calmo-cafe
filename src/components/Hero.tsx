import Image from "next/image";
import { OpenStatus } from "@/components/OpenStatus";
import type { HeroCopyContent } from "@/lib/cms/types";
import { isMenuEnabled } from "@/lib/features";
import { sectionX } from "@/lib/section";
import type { VenueHours } from "@/lib/venue";
import { ArrowDown } from "lucide-react";

type HeroProps = {
  hero: HeroCopyContent;
  hours: VenueHours[];
};

export function Hero({ hero, hours }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full origin-top scale-[1.08] object-cover object-center blur-[4px] md:blur-[6px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/gallery/gallery-interior-poster.jpg"
          aria-hidden
        >
          <source src="/gallery/gallery-interior.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_62%_60%_at_50%_46%,rgba(50,27,15,0.26),transparent_72%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(50,27,15,0.14))]"
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center ${sectionX} pt-24 pb-24 text-center sm:pb-32`}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <p className="animate-fade-up mb-6 font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-beige/90 [text-shadow:0_1px_10px_rgba(50,27,15,0.55)]">
            {hero.neighborhood}
            <span className="text-calmo-beige/55"> · </span>
            <span className="text-calmo-blue">{hero.walkInsLabel}</span>
          </p>

          <div className="animate-fade-up-delay-1">
            <Image
              src="/hero-badge.png"
              alt="Calmo"
              width={1024}
              height={962}
              priority
              unoptimized
              className="mx-auto h-auto w-56 sm:w-64 md:w-72"
            />
          </div>

          <h1 className="animate-fade-up-delay-2 mt-8 max-w-2xl font-title1 text-3xl font-bold leading-tight tracking-tight text-calmo-beige sm:text-4xl md:text-5xl [text-shadow:0_2px_14px_rgba(50,27,15,0.65)]">
            {hero.tagline}
          </h1>

          <p className="animate-fade-up-delay-2 mt-4 max-w-md font-body text-sm leading-relaxed text-calmo-beige/80 sm:text-base [text-shadow:0_1px_10px_rgba(50,27,15,0.55)]">
            {hero.subtitle}
          </p>

          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <OpenStatus hours={hours} />
            <a
              href={isMenuEnabled() ? "#menu" : "#gallery"}
              className="inline-flex items-center gap-2 rounded-full bg-calmo-beige px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.14em] text-calmo-burnt-brown transition-all hover:bg-calmo-blue hover:text-calmo-burnt-brown hover:shadow-lg hover:shadow-calmo-blue/25"
            >
              {isMenuEnabled() ? "View Menu" : "Follow along"}
              <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-calmo-beige/50">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
