import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "text-2xl sm:text-3xl",
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-6xl md:text-7xl",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <span
      aria-label="Calmo"
      className={cn(
        "inline-flex items-baseline font-title font-extrabold leading-none tracking-tighter text-current",
        sizes[size],
        className,
      )}
    >
      CALM
      <span
        aria-hidden
        className="relative -ml-0.5 inline-block translate-y-[0.08em] font-display not-italic"
      >
        ,
      </span>
    </span>
  );
}
