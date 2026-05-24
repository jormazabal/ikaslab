import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-manga-coral text-white shadow-button hover:-translate-y-0.5 active:translate-y-0",
  secondary: "bg-white text-ink border border-manga-line shadow-sm hover:border-manga-cyan",
  ghost: "bg-transparent text-ink hover:bg-white/70",
  danger: "bg-red-500 text-white shadow-button hover:-translate-y-0.5",
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:focus-ring",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
