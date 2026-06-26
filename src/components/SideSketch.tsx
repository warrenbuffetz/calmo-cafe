import Image from "next/image";

type SideSketchProps = {
  src: string;
  width: number;
  height: number;
  className: string;
};

export function SideSketch({ src, width, height, className }: SideSketchProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      unoptimized
      width={width}
      height={height}
      className={`pointer-events-none absolute z-0 select-none ${className}`}
    />
  );
}
