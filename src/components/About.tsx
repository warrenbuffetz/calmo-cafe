import { AboutPillarImage } from "@/components/AboutPillarImage";
import { sectionShell } from "@/lib/section";

const pillars = [
  {
    src: "/about-rooted.png",
    alt: "Calmo storefront sign on Dundas West",
    title: "Rooted here",
    description: "A neighborhood cafe bar on Dundas West — familiar faces and open doors.",
  },
  {
    src: "/about-people.png",
    alt: "Guests at the Calmo counter",
    title: "Made for people",
    description: "A place to slow down, catch up, and stay awhile.",
  },
  {
    src: "/about-food.png",
    alt: "Pastries coming out of the oven at Calmo",
    title: "Made with care",
    description: "House-made desserts and coffee, baked and poured with intention.",
  },
  {
    src: "/about-simple.png",
    alt: "Slices of pie and Basque cheesecake at Calmo",
    title: "Made to be simple",
    description: "Pastry and coffee for now. Wine and simple plates on the way.",
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
            Not just a cafe bar.
            <br />
            A corner of the neighborhood.
          </h2>
          <div className="mx-auto mt-5 h-px w-12 bg-calmo-blue" />
        </header>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-8 lg:grid-cols-4 lg:gap-x-6">
          {pillars.map(({ src, alt, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="relative flex min-h-[200px] w-full items-center justify-center sm:min-h-[240px] lg:min-h-[280px]">
                <AboutPillarImage src={src} alt={alt} />
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
      </div>
    </section>
  );
}
