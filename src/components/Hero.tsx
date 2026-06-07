import { Logo } from "@/components/Logo";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-calmo-blue/25 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-calmo-red-brown/10 blur-3xl sm:h-72 sm:w-72"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="animate-fade-up mb-6 font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
          Walk-ins only
        </p>

        <div className="animate-fade-up-delay-1 text-calmo-burnt-brown">
          <Logo size="lg" className="mx-auto" />
        </div>

        <p className="animate-fade-up-delay-2 mt-8 max-w-lg font-accent text-xl italic leading-relaxed text-calmo-burnt-brown/85 sm:text-2xl">
          Calmo captures the warm moments created together.
        </p>

        <p className="animate-fade-up-delay-2 mt-4 max-w-md font-body text-sm leading-relaxed text-calmo-burnt-brown/60 sm:text-base">
          Simple food. Good coffee. No fuss.
        </p>

        <a
          href="#menu"
          className="animate-fade-up-delay-3 mt-10 inline-flex items-center gap-2 rounded-full bg-calmo-burnt-brown px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.14em] text-calmo-beige transition-all hover:bg-calmo-red-brown hover:shadow-lg hover:shadow-calmo-red-brown/15"
        >
          View Menu
          <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-calmo-burnt-brown/35">
          Scroll
        </span>
      </div>
    </section>
  );
}
