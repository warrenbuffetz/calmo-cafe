import { Logo } from "@/components/Logo";
import { sectionX } from "@/lib/section";
import { ArrowDown } from "lucide-react";

const YOUTUBE_EMBED_SRC =
  "https://www.youtube.com/embed/xqcC-QRgs78?autoplay=1&mute=1&loop=1&playlist=xqcC-QRgs78&controls=0&showinfo=0&disablekb=1";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video layer */}
      <div className="absolute inset-0">
        <iframe
          src={YOUTUBE_EMBED_SRC}
          title="Calmo cafe ambience"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[150vh] w-[150vw] max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
        />
      </div>

      {/* Gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-calmo-beige to-calmo-burnt-brown opacity-80"
      />

      {/* Foreground content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center ${sectionX} pt-24 pb-24 text-center sm:pb-32`}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <p className="animate-fade-up mb-6 font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Walk-ins only
          </p>

          <div className="animate-fade-up-delay-1 text-calmo-beige">
            <Logo size="lg" className="mx-auto" />
          </div>

          <h1 className="animate-fade-up-delay-2 mt-8 max-w-2xl font-title1 text-3xl font-bold leading-tight tracking-tight text-calmo-beige sm:text-4xl md:text-5xl">
            Calmo captures the warm moments created together.
          </h1>

          <p className="animate-fade-up-delay-2 mt-4 max-w-md font-body text-sm leading-relaxed text-calmo-beige/80 sm:text-base">
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
