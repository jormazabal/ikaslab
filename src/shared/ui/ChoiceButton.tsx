import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";

interface ChoiceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  trailing?: ReactNode;
}

export function ChoiceButton({ selected = false, trailing, className, children, ...props }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={clsx(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm text-ink shadow-sm transition focus-visible:focus-ring disabled:opacity-80",
        selected
          ? "border-manga-cyan bg-slate-900 text-white ring-2 ring-manga-cyan/45"
          : "border-manga-line bg-white hover:border-manga-cyan",
        className,
      )}
      {...props}
    >
      {selected && (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-manga-cyan text-white">
          <Check size={14} strokeWidth={3} aria-hidden />
        </span>
      )}
      <span className="font-black">{children}</span>
      {trailing}
    </button>
  );
}
