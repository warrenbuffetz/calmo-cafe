import Image from "next/image";
import { Coffee, Sparkles, UtensilsCrossed } from "lucide-react";
import { sectionShell } from "@/lib/section";

const pillars = [
  {
    src: "/about-rooted.png",
    alt: "Calmo cafe storefront on a neighborhood corner",
    title: "Rooted here",
    description: "A neighborhood spot with familiar faces and open doors.",
  },
  {
    src: "/about-people.png",
    alt: "Friends gathered around a cafe table sharing coffee",
    title: "Made for people",
    description: "A place to slow down, catch up, and feel at home.",
  },
  {
    src: "/about-food.png",
    alt: "Avocado toast with a fried egg and a Calmo latte with heart art",
    title: "Made with care",
    description: "Thoughtful brunch plates and coffee, made with quality ingredients.",
  },
  {
    src: "/about-simple.png",
    alt: "A simple wooden chair beside a vase with budding branches",
    title: "Made to be simple",
    description: "No fuss, no rush. Just good food and good vibes.",
  },
] as const;

export function About() {
  return (
    <section id="about" className={`${sectionShell} relative overflow-x-clip`}>
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="text-center">
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-blue">
            About Calmo
          </p>
          <h2 className="mt-4 font-title text-3xl font-bold leading-tight tracking-tight text-calmo-burnt-brown sm:text-4xl md:text-5xl">
            Not just a café.
            <br />
            A corner of the neighborhood.
          </h2>
          <div className="mx-auto mt-5 h-px w-12 bg-calmo-blue" />
        </header>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-8 lg:grid-cols-4 lg:gap-x-6">
          {pillars.map(({ src, alt, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="relative flex min-h-[200px] w-full items-center justify-center sm:min-h-[240px] lg:min-h-[280px]">
                <Image
                  src={src}
                  alt={alt}
                  width={1024}
                  height={1024}
                  unoptimized
                  className="h-auto max-h-[220px] w-full max-w-[220px] object-contain sm:max-h-[260px] sm:max-w-[260px] lg:max-h-[300px] lg:max-w-[300px]"
                  sizes="(min-width: 1024px) 22vw, 45vw"
                />
              </div>
              <h3 className="mt-4 font-title text-base font-bold text-calmo-burnt-brown sm:text-lg">
                {title}
              </h3>
              <p className="mt-2 max-w-[16rem] font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
                {description}
              </p>
            </div>
          ))}
        </div>

        <ul className="mt-14 flex flex-wrap justify-center gap-3">
          {[
            { icon: UtensilsCrossed, label: "Brunch plates" },
            { icon: Coffee, label: "Perfect coffee" },
            { icon: Sparkles, label: "No fuss" },
          ].map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-calmo-burnt-brown/12 bg-white/30 px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.12em] text-calmo-burnt-brown/70 transition-colors hover:border-calmo-blue hover:bg-calmo-blue/20 hover:text-calmo-burnt-brown"
            >
              <Icon className="h-3.5 w-3.5 text-calmo-red-brown" strokeWidth={1.75} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
