import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { SketchField } from "@/components/SketchField";
import { sectionShell } from "@/lib/section";
import { cn } from "@/lib/utils";

const INSTAGRAM_URL = "https://www.instagram.com/calmo.cafebar/";

const galleryBodyText =
  "max-w-sm font-text1 text-sm leading-relaxed text-calmo-burnt-brown/85 sm:text-base";

type TapeVariant = "plain" | "grid" | "wide" | "corner";

type CollageItem = {
  src: string;
  alt: string;
  aspect: string;
  placement: string;
  tape?: TapeVariant;
  tapeRotate?: string;
};

const collageItems: CollageItem[] = [
  {
    src: "/gallery/gallery-sign.jpg",
    alt: "Calmo storefront sign on Dundas West",
    aspect: "aspect-[3/4]",
    placement:
      "w-[78%] -rotate-2 self-start md:w-[64%] lg:absolute lg:left-0 lg:top-0 lg:w-[34%] lg:-rotate-[2deg] lg:z-10",
    tape: "plain",
    tapeRotate: "-rotate-1",
  },
  {
    src: "/gallery/gallery-chef-portrait.jpg",
    alt: "Chef in the Calmo kitchen",
    aspect: "aspect-[3/4]",
    placement:
      "w-[72%] rotate-1 self-end md:w-[58%] lg:absolute lg:left-[36%] lg:top-1 lg:w-[24%] lg:rotate-[1.5deg] lg:z-[15]",
    tape: "corner",
    tapeRotate: "rotate-[4deg]",
  },
  {
    src: "/gallery/gallery-counter.jpg",
    alt: "Guests at the Calmo cafe counter",
    aspect: "aspect-[3/4]",
    placement:
      "w-[76%] rotate-[1.5deg] self-end md:w-[62%] lg:absolute lg:right-0 lg:top-2 lg:w-[34%] lg:rotate-2 lg:z-20",
    tape: "wide",
    tapeRotate: "rotate-1",
  },
  {
    src: "/gallery/gallery-prep-mixing.jpg",
    alt: "Dessert prep in the Calmo kitchen",
    aspect: "aspect-[3/4]",
    placement:
      "w-[70%] -rotate-[1.5deg] self-center md:w-[56%] lg:absolute lg:left-[40%] lg:top-[24%] lg:w-[24%] lg:-rotate-[1.5deg] lg:z-[18]",
    tape: "grid",
    tapeRotate: "-rotate-[2deg]",
  },
  {
    src: "/gallery/gallery-labeling.jpg",
    alt: "Hand-labeling desserts at the Calmo counter",
    aspect: "aspect-[3/4]",
    placement:
      "w-[74%] rotate-2 self-end md:w-[60%] lg:absolute lg:left-0 lg:top-[44%] lg:w-[21%] lg:rotate-[2deg] lg:z-[25]",
    tape: "grid",
    tapeRotate: "-rotate-[3deg]",
  },
  {
    src: "/gallery/gallery-menu.jpg",
    alt: "Calmo cafe menu with coffee and specialty drinks",
    aspect: "aspect-[720/406]",
    placement:
      "w-[88%] rotate-1 self-start md:w-[76%] lg:absolute lg:left-[18%] lg:top-[58%] lg:w-[44%] lg:rotate-[1deg] lg:z-10",
    tape: "plain",
    tapeRotate: "rotate-[0.5deg]",
  },
  {
    src: "/gallery/gallery-tray-desserts.jpg",
    alt: "Fresh tray of desserts from the Calmo oven",
    aspect: "aspect-[3/4]",
    placement:
      "w-[76%] -rotate-1 self-end md:w-[62%] lg:absolute lg:right-0 lg:bottom-2 lg:w-[28%] lg:-rotate-[1.5deg] lg:z-30",
    tape: "corner",
    tapeRotate: "-rotate-2",
  },
];

const pastriesItem = {
  src: "/gallery/gallery-pastries.jpg",
  alt: "Pastries and desserts at Calmo",
  aspect: "aspect-[720/406]",
  placement: "w-full max-w-md -rotate-[1.25deg]",
  tape: "wide" as const,
  tapeRotate: "-rotate-1",
};

function InstagramCta({ className }: { className?: string }) {
  return (
    <Link
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full bg-calmo-burnt-brown px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.14em] text-calmo-beige transition-all hover:bg-calmo-blue hover:text-calmo-burnt-brown hover:shadow-lg hover:shadow-calmo-blue/25",
        className,
      )}
    >
      <Instagram className="h-4 w-4" strokeWidth={1.75} />
      Follow on Instagram
    </Link>
  );
}

function MaskingTape({
  variant = "plain",
  className,
}: {
  variant?: TapeVariant;
  className?: string;
}) {
  const isGrid = variant === "grid";
  const isWide = variant === "wide";

  return (
    <div
      aria-hidden
      className={cn(
        "absolute z-20 shadow-[0_1px_2px_rgba(50,27,15,0.08)]",
        isWide ? "h-[17px] w-[4.5rem]" : "h-[18px] w-[3.25rem]",
        isGrid
          ? "bg-[#e5dcc8]/80 [background-image:linear-gradient(rgba(50,27,15,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(50,27,15,0.06)_1px,transparent_1px)] [background-size:5px_5px]"
          : "border border-[#d9cdb5]/50 bg-[#ebe3d0]/80",
        className,
      )}
    />
  );
}

function PhotoTape({ variant, tapeRotate }: { variant: TapeVariant; tapeRotate?: string }) {
  if (variant === "corner") {
    return (
      <>
        <MaskingTape
          variant="plain"
          className={cn("-left-1 top-2", tapeRotate ?? "-rotate-[8deg]")}
        />
        <MaskingTape
          variant="grid"
          className={cn("-right-0.5 top-3", tapeRotate ? `${tapeRotate} rotate-[6deg]` : "rotate-[6deg]")}
        />
      </>
    );
  }

  return (
    <MaskingTape
      variant={variant === "grid" ? "grid" : "plain"}
      className={cn(
        "-top-2.5 left-1/2 -translate-x-1/2",
        tapeRotate,
        variant === "wide" && "w-[4.75rem]",
        variant === "grid" && "w-[3.5rem]",
      )}
    />
  );
}

function GalleryIntro() {
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
        On Instagram
      </p>
      <h2 className="mt-4 font-title2 text-4xl leading-none text-calmo-burnt-brown sm:text-5xl">
        Follow along
      </h2>
      <p className={`mt-5 ${galleryBodyText}`}>
        Pastries, coffee, and everyday Calmo moments — straight from our feed. Tap any photo to see
        more on Instagram.
      </p>
      <InstagramCta className="mt-8" />
      <GalleryTile
        src={pastriesItem.src}
        alt={pastriesItem.alt}
        aspect={pastriesItem.aspect}
        placement={pastriesItem.placement}
        tape={pastriesItem.tape}
        tapeRotate={pastriesItem.tapeRotate}
        sizes="(min-width: 1024px) 22rem, 85vw"
        className="mt-8"
      />
    </div>
  );
}

type GalleryTileProps = {
  src: string;
  alt: string;
  aspect: string;
  placement: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  tape?: TapeVariant;
  tapeRotate?: string;
};

function GalleryTile({
  src,
  alt,
  aspect,
  placement,
  sizes,
  priority,
  className,
  tape,
  tapeRotate,
}: GalleryTileProps) {
  return (
    <Link
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${alt} on Instagram`}
      className={cn(
        "group relative block transition-transform duration-500 ease-out hover:z-40 hover:-translate-y-1",
        placement,
        className,
      )}
    >
      {tape && <PhotoTape variant={tape} tapeRotate={tapeRotate} />}

      <div className="overflow-hidden rounded-sm bg-white p-1.5 shadow-[3px_6px_0_rgba(50,27,15,0.09)] transition-shadow duration-500 group-hover:shadow-[5px_10px_0_rgba(50,27,15,0.12)] md:p-2">
        <div className={cn("relative w-full overflow-hidden", aspect)}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes={sizes}
            priority={priority}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-sm bg-calmo-burnt-brown/0 transition-colors duration-300 group-hover:bg-calmo-burnt-brown/8" />
      <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-calmo-beige/95 p-2 text-calmo-burnt-brown opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 md:bottom-5 md:right-5">
        <Instagram className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
    </Link>
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
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
          <GalleryIntro />

          <div className="relative flex flex-col gap-10 md:gap-12 lg:min-h-[580px] lg:gap-0">
            {collageItems.map((item, index) => (
              <GalleryTile
                key={item.src}
                src={item.src}
                alt={item.alt}
                aspect={item.aspect}
                placement={item.placement}
                tape={item.tape}
                tapeRotate={item.tapeRotate}
                sizes="(min-width: 1024px) 30vw, 85vw"
                priority={index < 2}
              />
            ))}
          </div>
        </div>

        <p className="mt-12 text-center font-body text-sm text-calmo-burnt-brown/60 lg:mt-14">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-calmo-red-brown transition-colors hover:text-calmo-blue"
          >
            @calmo.cafebar
          </Link>
          {" · "}
          New posts weekly
        </p>
      </div>
    </section>
  );
}
