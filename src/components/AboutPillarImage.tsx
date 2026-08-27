import Image from "next/image";

type AboutPillarImageProps = {
  src: string;
  alt: string;
};

export function AboutPillarImage({ src, alt }: AboutPillarImageProps) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[300px]">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-contain object-center"
        sizes="(min-width: 1024px) 22vw, 45vw"
      />
    </div>
  );
}
