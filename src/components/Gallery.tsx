import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { SketchField } from "@/components/SketchField";
import { sectionShell, sectionSurfaceBase } from "@/lib/section";
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
  ownerNote?: boolean;
  kraftNote?: boolean;
  pushPin?: boolean;
};

const collageItems: CollageItem[] = [
  {
    src: "/gallery/gallery-sign.jpg",
    alt: "Calmo storefront sign on Dundas West",
    aspect: "aspect-[3/4]",
    placement:
      "w-[78%] -rotate-2 self-start md:w-[64%] lg:absolute lg:left-0 lg:top-5 lg:w-[34%] lg:-rotate-[2deg] lg:z-10",
    tape: "plain",
    tapeRotate: "-rotate-1",
  },
  {
    src: "/gallery/gallery-chef-portrait.jpg",
    alt: "Jinho in the Calmo kitchen",
    aspect: "aspect-[3/4]",
    placement:
      "w-[76%] rotate-[1.5deg] self-end md:w-[62%] lg:absolute lg:right-0 lg:top-2 lg:w-[34%] lg:rotate-2 lg:z-20",
    ownerNote: true,
    pushPin: true,
  },
  {
    src: "/gallery/gallery-counter.jpg",
    alt: "Guests at the Calmo cafe counter",
    aspect: "aspect-[3/4]",
    placement:
      "w-[72%] rotate-1 self-end md:w-[58%] lg:absolute lg:left-[36%] lg:top-1 lg:w-[24%] lg:rotate-[1.5deg] lg:z-[15]",
    tape: "wide",
    tapeRotate: "rotate-1",
  },
  {
    src: "/gallery/gallery-prep-mixing.jpg",
    alt: "Dessert prep in the Calmo kitchen",
    aspect: "aspect-[3/4]",
    placement:
      "w-[70%] -rotate-[1.5deg] self-center md:w-[56%] lg:absolute lg:left-[40%] lg:top-[27%] lg:w-[24%] lg:-rotate-[1.5deg] lg:z-[18]",
    tape: "grid",
    tapeRotate: "-rotate-[2deg]",
  },
  {
    src: "/gallery/gallery-self-service.jpg",
    alt: "Self-service water, cups, and napkins at the Calmo counter",
    aspect: "aspect-[3/4]",
    placement:
      "w-[74%] rotate-2 self-end md:w-[60%] lg:absolute lg:left-0 lg:top-[44%] lg:w-[21%] lg:rotate-[2deg] lg:z-[25]",
    tape: "grid",
    tapeRotate: "-rotate-[3deg]",
  },
  {
    src: "/gallery/gallery-counter-labeling.jpg",
    alt: "Writing kraft labels for pastries at the Calmo counter",
    aspect: "aspect-[3/4]",
    placement:
      "w-[80%] rotate-1 self-start md:w-[68%] lg:absolute lg:left-[12%] lg:top-[56%] lg:w-[34%] lg:rotate-[1.5deg] lg:z-10",
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
    kraftNote: true,
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

const tapeAssets = {
  plain: {
    src: "/gallery/gallery-tape-plain.png",
    width: 883,
    height: 294,
  },
  grid: {
    src: "/gallery/gallery-tape-grid.png",
    width: 833,
    height: 293,
  },
} as const;

function MaskingTape({
  variant = "plain",
  wide = false,
  className,
}: {
  variant?: keyof typeof tapeAssets;
  wide?: boolean;
  className?: string;
}) {
  const asset = tapeAssets[variant];

  return (
    <Image
      src={asset.src}
      alt=""
      aria-hidden
      width={asset.width}
      height={asset.height}
      unoptimized
      className={cn(
        "absolute z-20 h-auto drop-shadow-[0_1px_3px_rgba(50,27,15,0.14)]",
        wide ? "w-[5rem]" : variant === "grid" ? "w-[3.5rem]" : "w-[3.25rem]",
        className,
      )}
    />
  );
}

function OwnerNoteAccent() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-3 -right-6 z-30 w-[7.5rem] rotate-[5deg] drop-shadow-[2px_4px_8px_rgba(50,27,15,0.16)] sm:-bottom-4 sm:-right-7 sm:w-[8.25rem]"
    >
      <Image
        src="/gallery/gallery-owner-note.png"
        alt=""
        width={935}
        height={472}
        unoptimized
        className="h-auto w-full"
      />
    </div>
  );
}

function PushPinAccent() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-30 w-9 -translate-x-1/2 -translate-y-[45%] drop-shadow-[0_2px_5px_rgba(50,27,15,0.28)] sm:w-10"
    >
      <Image
        src="/gallery/gallery-pin.png"
        alt=""
        width={575}
        height={570}
        unoptimized
        className="h-auto w-full"
      />
    </div>
  );
}

function PhotoTape({ variant, tapeRotate }: { variant: TapeVariant; tapeRotate?: string }) {
  if (variant === "corner") {
    return (
      <>
        <MaskingTape
          variant="plain"
          className={cn(
            "left-0 top-0 w-[3rem] -translate-x-[32%] -translate-y-[36%] -rotate-45",
            tapeRotate,
          )}
        />
        <MaskingTape
          variant="grid"
          className={cn(
            "right-0 top-0 w-[3rem] translate-x-[32%] -translate-y-[36%] rotate-45",
            tapeRotate,
          )}
        />
      </>
    );
  }

  return (
    <MaskingTape
      variant={variant === "grid" ? "grid" : "plain"}
      wide={variant === "wide"}
      className={cn("-top-3 left-1/2 -translate-x-1/2", tapeRotate)}
    />
  );
}

function FreshFromCounterCallout() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-1 z-20 translate-y-[32%] sm:left-3"
    >
      <Image
        src="/gallery/gallery-fresh-from-counter.png"
        alt=""
        width={634}
        height={721}
        unoptimized
        className="h-auto w-[7rem] drop-shadow-[0_1px_0_rgba(243,238,215,0.35)] sm:w-[7.8rem] lg:w-[8.2rem]"
      />
    </div>
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
      <div className="relative mt-8 pb-16 sm:pb-[4.5rem]">
        <GalleryTile
          src={pastriesItem.src}
          alt={pastriesItem.alt}
          aspect={pastriesItem.aspect}
          placement={pastriesItem.placement}
          tape={pastriesItem.tape}
          tapeRotate={pastriesItem.tapeRotate}
          sizes="(min-width: 1024px) 22rem, 85vw"
        />
        <FreshFromCounterCallout />
      </div>
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
  ownerNote?: boolean;
  kraftNote?: boolean;
  pushPin?: boolean;
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
  ownerNote,
  kraftNote,
  pushPin,
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
      {pushPin && <PushPinAccent />}
      {tape && <PhotoTape variant={tape} tapeRotate={tapeRotate} />}
      {ownerNote && <OwnerNoteAccent />}
      {kraftNote && <GalleryKraftNote />}

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

function GalleryKraftNote() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-full right-[-0.25rem] z-[32] mt-2 w-[10.5rem] rotate-[1.5deg] drop-shadow-[4px_9px_18px_rgba(50,27,15,0.26)] sm:mt-3 sm:w-[11.5rem] lg:right-0 lg:w-[12.5rem] lg:rotate-[2deg]"
    >
      <Image
        src="/gallery/gallery-kraft-note.png"
        alt=""
        width={976}
        height={491}
        unoptimized
        className="h-auto w-full"
      />
    </div>
  );
}

function GalleryStemAccent() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[7%] left-0 z-[35] hidden w-[4.75rem] -translate-x-[calc(100%+1.5rem)] rotate-[1deg] drop-shadow-[2px_5px_10px_rgba(50,27,15,0.16)] lg:block lg:top-[9%] lg:w-[5.25rem]"
    >
      <Image
        src="/gallery/gallery-dried-stem.png"
        alt=""
        width={413}
        height={662}
        unoptimized
        className="h-auto w-full"
      />
      <MaskingTape
        variant="plain"
        className="left-1/2 top-[58%] z-10 w-[2.85rem] -translate-x-1/2 -rotate-[1deg] opacity-95"
      />
    </div>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className={`${sectionShell} ${sectionSurfaceBase} relative overflow-x-clip`}>
      <SketchField
        items={[
          {
            src: "/sketch-loops.png",
            width: 844,
            height: 1024,
            className: "hidden lg:block -left-24 -top-20 w-[22rem] opacity-[0.06]",
          },
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
            className: "hidden lg:block -right-20 -top-16 w-[16rem] rotate-6 opacity-[0.05]",
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
        <div className="relative flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
          <GalleryIntro />

          <div className="relative flex flex-col gap-10 md:gap-12 lg:min-h-[580px] lg:gap-0 lg:pb-24">
            <GalleryStemAccent />
            {collageItems.map((item, index) => (
              <GalleryTile
                key={item.src}
                src={item.src}
                alt={item.alt}
                aspect={item.aspect}
                placement={item.placement}
                tape={item.tape}
                tapeRotate={item.tapeRotate}
                ownerNote={item.ownerNote}
                kraftNote={item.kraftNote}
                pushPin={item.pushPin}
                sizes="(min-width: 1024px) 30vw, 85vw"
                priority={index < 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
