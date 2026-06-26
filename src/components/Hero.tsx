import Image from "next/image";
import { sectionX } from "@/lib/section";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Storefront illustration */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero-storefront.png"
          alt=""
          aria-hidden
          fill
          priority
          unoptimized
          className="scale-100 object-cover blur-[4px] md:blur-[6px]"
        />
      </div>

      {/* Center scrim: contrast behind the text */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_62%_60%_at_50%_46%,rgba(50,27,15,0.32),transparent_72%)]"
      />
      {/* Soft edge vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(50,27,15,0.24))]"
      />

      {/* Foreground content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center ${sectionX} pt-24 pb-24 text-center sm:pb-32`}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <p className="animate-fade-up mb-6 font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Walk-ins only
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
            Calmo captures the warm moments created together.
          </h1>

          <p className="animate-fade-up-delay-2 mt-4 max-w-md font-body text-sm leading-relaxed text-calmo-beige/80 sm:text-base [text-shadow:0_1px_10px_rgba(50,27,15,0.55)]">
            Simple food. Good coffee. No fuss.
          </p>

          <a
            href="#menu"
            className="animate-fade-up-delay-3 mt-10 inline-flex items-center gap-2 rounded-full bg-calmo-beige px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.14em] text-calmo-burnt-brown transition-all hover:bg-calmo-blue hover:text-calmo-burnt-brown hover:shadow-lg hover:shadow-calmo-blue/25"
          >
            View Menu
            <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
          </a>
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
