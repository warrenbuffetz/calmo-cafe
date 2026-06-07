import { Coffee, Croissant, Sparkles } from "lucide-react";

export function About() {
  return (
    <section id="about" className="border-t border-calmo-burnt-brown/8 px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24 lg:items-center">
        <div>
          <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            The vibe
          </p>
          <h2 className="mt-4 font-title text-3xl font-bold leading-tight tracking-tight text-calmo-burnt-brown sm:text-4xl md:text-5xl">
            Your neighborhood spot for the good stuff.
          </h2>
        </div>

        <div className="space-y-6">
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
                className="inline-flex items-center gap-2 rounded-full border border-calmo-burnt-brown/12 bg-white/30 px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.12em] text-calmo-burnt-brown/70"
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
