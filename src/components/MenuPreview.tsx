import { cn } from "@/lib/utils";

type MenuItem = {
  name: string;
  description: string;
  category: "diner" | "cafe";
  tag?: string;
};

const menuItems: MenuItem[] = [
  {
    name: "The Calmo Breakfast Sando",
    description: "Soft scrambled eggs, smoked gouda, house sauce",
    category: "diner",
    tag: "Signature",
  },
  {
    name: "Stuffed Madeleines",
    description: "Fresh baked daily",
    category: "cafe",
    tag: "Pastry",
  },
  {
    name: "Classic Cheeseburger",
    description: "Simple, perfect crust",
    category: "diner",
  },
  {
    name: "Bulgogi Croque Madame",
    description: "Korean-spiced beef, gruyère, fried egg, béchamel",
    category: "cafe",
    tag: "Fusion",
  },
];

const categoryStyles = {
  diner: {
    badge: "bg-calmo-red-brown/12 text-calmo-red-brown",
    accent: "group-hover:border-calmo-red-brown/30",
  },
  cafe: {
    badge: "bg-calmo-blue/35 text-calmo-burnt-brown",
    accent: "group-hover:border-calmo-blue/50",
  },
};

export function MenuPreview() {
  return (
    <section id="menu" className="border-t border-calmo-burnt-brown/8 bg-white/20 px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
              Menu preview
            </p>
            <h2 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl md:text-5xl">
              Two sides of the same counter.
            </h2>
          </div>
          <p className="max-w-xs font-body text-sm leading-relaxed text-calmo-burnt-brown/60">
            Retro diner classics on the left. Modern café creations on the right. All made in-house,
            all day.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {menuItems.map((item) => {
            const styles = categoryStyles[item.category];
            return (
              <article
                key={item.name}
                className={cn(
                  "group rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-calmo-burnt-brown/5 sm:p-8",
                  styles.accent,
                )}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      "inline-block rounded-full px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em]",
                      styles.badge,
                    )}
                  >
                    {item.category === "diner" ? "Diner" : "Café"}
                  </span>
                  {item.tag && (
                    <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-calmo-burnt-brown/40">
                      {item.tag}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl leading-snug text-calmo-burnt-brown sm:text-[1.65rem]">
                  {item.name}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-calmo-burnt-brown/65 sm:text-base">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-12 text-center font-accent text-sm italic text-calmo-burnt-brown/50">
          Full menu available in-store. Pastries change daily — visit us to see what&apos;s fresh.
        </p>
      </div>
    </section>
  );
}
