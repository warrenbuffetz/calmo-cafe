import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClassName =
  "w-full rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige/60 px-4 py-3 font-body text-sm text-calmo-burnt-brown outline-none transition-colors placeholder:text-calmo-burnt-brown/35 focus:border-calmo-blue/60";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-body text-xs font-medium uppercase tracking-[0.18em] text-calmo-burnt-brown/70"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-2 font-body text-sm text-calmo-red-brown">{error}</p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { error?: boolean };

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(fieldClassName, error && "border-calmo-red-brown/50", className)}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean };

export function Select({ className, error, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(fieldClassName, error && "border-calmo-red-brown/50", className)}
      {...props}
    >
      {children}
    </select>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean };

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        fieldClassName,
        "min-h-[120px] resize-y",
        error && "border-calmo-red-brown/50",
        className,
      )}
      {...props}
    />
  );
}
