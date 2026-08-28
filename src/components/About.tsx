import Image from "next/image";
import { AboutPillarImage } from "@/components/AboutPillarImage";
import { SketchField } from "@/components/SketchField";
import { sectionShell } from "@/lib/section";

const pillars = [
  {
    src: "/about-rooted.png",
    alt: "Calmo storefront sign with watercolor border",
    title: "Rooted here",
    description: "A neighborhood cafe bar on Dundas West — familiar faces and open doors.",
    accent: {
      src: "/about-sketch-heart.png",
      width: 522,
      height: 631,
      className: "mt-3 h-auto w-[1.75rem] sm:w-[2rem]",
    },
  },
  {
    src: "/about-people.png",
    alt: "Guests at the Calmo counter with watercolor border",
    title: "Made for people",
    description: "A place to slow down, catch up, and stay awhile.",
  },
  {
    src: "/about-food.png",
    alt: "Baker presenting fresh tray from the Calmo kitchen",
    title: "Made with care",
    description: "House-made desserts and coffee, baked and poured with intention.",
    accent: {
      src: "/about-sketch-swoosh.png",
      width: 772,
      height: 126,
      className: "mt-3 h-auto w-[6.75rem] sm:w-[7.25rem]",
    },
  },
  {
    src: "/about-simple.png",
    alt: "Labeled pie slices and Basque cheesecake at Calmo",
    title: "Made to be simple",
    description: "Pastry and coffee, kept simple.",
  },
] as const;

export function About() {
  return (
    <section id="about" className={`${sectionShell} relative overflow-x-clip`}>
      <SketchField
        items={[
          {
            src: "/sketch-plate.png",
            width: 741,
            height: 1024,
            className: "hidden lg:block -right-24 -bottom-32 w-[22rem] opacity-[0.18]",
          },
          {
            src: "/sketch-dish.png",
            width: 1024,
            height: 964,
            className: "hidden lg:block -left-16 top-8 w-[13rem] -rotate-6 opacity-[0.07]",
          },
          {
            src: "/sketch-brunch.png",
            width: 733,
            height: 1024,
            className: "hidden lg:block right-[6%] top-[28%] w-[11rem] rotate-6 opacity-[0.06]",
          },
          {
            src: "/sketch-cup.png",
            width: 910,
            height: 1024,
            className: "hidden lg:block -left-10 -bottom-28 w-[11rem] -rotate-6 opacity-[0.13]",
          },
        ]}
      />
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
          <div className="mx-auto mt-5 flex justify-center sm:mt-6">
            <Image
              src="/about-sketch-map.png"
              alt="Hand-drawn map of Calmo at Dundas St W and Grove Ave"
              width={855}
              height={438}
              unoptimized
              className="h-auto w-[min(100%,19rem)] sm:w-[22rem] lg:w-[24rem]"
            />
          </div>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-10 lg:grid-cols-4 lg:gap-x-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-center text-center">
              <div className="relative flex min-h-[200px] w-full items-center justify-center sm:min-h-[240px] lg:min-h-[280px]">
                <AboutPillarImage src={pillar.src} alt={pillar.alt} />
              </div>
              <h3 className="mt-4 font-title text-base font-bold text-calmo-burnt-brown sm:text-lg">
                {pillar.title}
              </h3>
              <p className="mt-2 max-w-[16rem] font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
                {pillar.description}
              </p>
              {"accent" in pillar ? (
                <Image
                  src={pillar.accent.src}
                  alt=""
                  aria-hidden
                  width={pillar.accent.width}
                  height={pillar.accent.height}
                  unoptimized
                  className={pillar.accent.className}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
