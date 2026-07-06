import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "dark";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-calmo-beige text-calmo-burnt-brown hover:bg-calmo-blue hover:shadow-lg hover:shadow-calmo-blue/25",
  secondary:
    "border border-calmo-burnt-brown/15 bg-transparent text-calmo-burnt-brown hover:border-calmo-blue hover:bg-calmo-blue/20",
  dark: "bg-calmo-burnt-brown text-calmo-beige hover:bg-calmo-blue hover:text-calmo-burnt-brown hover:shadow-lg hover:shadow-calmo-blue/25",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-body text-sm font-medium uppercase tracking-[0.14em] transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
