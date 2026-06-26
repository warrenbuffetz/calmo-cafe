import Image from "next/image";
import { Coffee, Croissant, Sparkles } from "lucide-react";
import { SketchField } from "@/components/SketchField";
import { sectionShell } from "@/lib/section";

export function About() {
  return (
    <section id="about" className={`${sectionShell} relative overflow-x-clip`}>
      <SketchField
        items={[
          {
            src: "/sketch-people.png",
            width: 1024,
            height: 1003,
            className: "hidden lg:block -left-32 -bottom-28 w-[30rem] opacity-[0.048]",
          },
          {
            src: "/sketch-plant.png",
            width: 879,
            height: 1024,
            className: "hidden lg:block right-4 top-6 w-[12rem] rotate-3 opacity-[0.084]",
          },
        ]}
      />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src="/about-cups.png"
            alt="Calmo branded takeaway cups around a fresh latte"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
              The vibe
            </p>
            <h2 className="mt-4 font-title text-3xl font-bold leading-tight tracking-tight text-calmo-burnt-brown sm:text-4xl md:text-5xl">
              Your neighborhood spot for the good stuff.
            </h2>
          </div>

          <p className="font-body text-base leading-relaxed text-calmo-burnt-brown/75 sm:text-lg">
            Calmo is where the retro diner counter meets the pastry case — fresh baked madeleines
            on one side, a perfectly crusted cheeseburger on the other. We&apos;re not trying to
            reinvent breakfast. We&apos;re just making it really, really well.
          </p>
          <p className="font-accent text-lg italic leading-relaxed text-calmo-burnt-brown/70 sm:text-xl">
            Think elevated sandwiches, daily pastries, and coffee that actually tastes like something.
            No reservations, no performance — just a calm place to eat.
          </p>

          <ul className="flex flex-wrap gap-3 pt-2">
            {[
              { icon: Croissant, label: "Fresh pastries" },
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
      </div>
    </section>
  );
}
