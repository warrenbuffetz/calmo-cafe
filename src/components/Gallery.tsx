import Image from "next/image";
import { SketchField } from "@/components/SketchField";
import { sectionShell } from "@/lib/section";

const imageGap = "gap-5 lg:gap-6";
const columnGap = "gap-x-5 lg:gap-x-6";
const galleryBodyText =
  "max-w-xs font-text1 text-sm leading-relaxed text-calmo-burnt-brown/85 sm:text-base";

function GalleryIntro() {
  return (
    <div>
      <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
        Our community
      </p>
      <h2 className="mt-4 font-title2 text-4xl leading-none text-calmo-burnt-brown sm:text-5xl">
        Gallery
      </h2>
      <p className={`mt-5 ${galleryBodyText}`}>
        Every cup tells a story — here&apos;s a look at the cozy scenes and familiar smiles we see
        every day.
      </p>
    </div>
  );
}

function GalleryClosingText({ className }: { className?: string }) {
  return (
    <p
      className={`${galleryBodyText} ${className ?? ""}`}
    >
      From morning brews to late afternoon bites, this is the world of Calmo in little frames.
    </p>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className={`${sectionShell} relative overflow-x-clip`}>
      <SketchField
        items={[
          {
            src: "/sketch-loops.png",
            width: 844,
            height: 1024,
            className: "hidden lg:block -left-24 -bottom-24 w-[24rem] opacity-[0.07]",
          },
          {
            src: "/sketch-brunch.png",
            width: 733,
            height: 1024,
            className: "hidden lg:block -right-20 -bottom-20 w-[18rem] rotate-6 opacity-[0.06]",
          },
        ]}
      />
      <div className="relative z-10 mx-auto max-w-6xl text-calmo-burnt-brown">
        {/* Mobile: single-column stack */}
        <div className={`flex flex-col ${imageGap} md:hidden`}>
          <GalleryIntro />
          <div className="relative aspect-[2/3] w-full">
            <Image
              src="/2.jpg"
              alt="Calmo cafe counter and pendant lights"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="relative aspect-[3/4] w-full">
            <Image src="/1.jpg" alt="Calmo window seating" fill className="object-cover" sizes="100vw" />
          </div>
          <div className="relative aspect-[3/4] w-full">
            <Image src="/3.jpg" alt="Calmo dining corner" fill className="object-cover" sizes="100vw" />
          </div>
          <GalleryClosingText />
        </div>

        {/* Desktop: asymmetrical editorial grid */}
        <div
          className={`hidden md:grid md:min-h-[720px] md:grid-cols-3 md:items-stretch ${columnGap}`}
        >
          {/* Left column */}
          <div className="flex flex-col justify-between">
            <GalleryIntro />
            <div className="relative mt-10 aspect-[3/4] w-full lg:mt-12">
              <Image src="/1.jpg" alt="Calmo window seating" fill className="object-cover" sizes="33vw" />
            </div>
          </div>

          {/* Center column */}
          <div className="relative min-h-[720px] w-full">
            <Image
              src="/2.jpg"
              alt="Calmo cafe counter and pendant lights"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full">
              <Image src="/3.jpg" alt="Calmo dining corner" fill className="object-cover" sizes="33vw" />
            </div>
            <GalleryClosingText className="mt-10 lg:mt-12" />
          </div>
        </div>
      </div>
    </section>
  );
}
