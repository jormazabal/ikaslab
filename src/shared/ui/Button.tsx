import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-panda-coral text-white shadow-button hover:-translate-y-0.5 active:translate-y-0",
  secondary: "bg-white text-ink border border-slate-200 shadow-sm hover:border-panda-leaf",
  ghost: "bg-transparent text-ink hover:bg-white/70",
  danger: "bg-red-500 text-white shadow-button hover:-translate-y-0.5",
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:focus-ring",
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
