import { clsx } from "clsx";
import logoMark from "../assets/brand/ikaslab-mark-128.png";

type BrandLogoSize = "sm" | "md" | "lg";

interface BrandLogoProps {
  size?: BrandLogoSize;
  showText?: boolean;
  className?: string;
}

const markSizes: Record<BrandLogoSize, string> = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

const titleSizes: Record<BrandLogoSize, string> = {
  sm: "text-lg",
  md: "text-3xl",
  lg: "text-4xl",
};

export function BrandLogo({ size = "sm", showText = true, className }: BrandLogoProps) {
  return (
    <div className={clsx("flex min-w-0 items-center gap-3", className)}>
      <img
        src={logoMark}
        alt={showText ? "" : "IkasLab"}
        className={clsx("shrink-0 object-contain drop-shadow-sm", markSizes[size])}
      />
      {showText && (
        <div className="min-w-0">
          <p className={clsx("truncate font-black leading-tight text-ink", titleSizes[size])}>IkasLab</p>
          <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-500">Learning studio</p>
        </div>
      )}
    </div>
  );
}
