import { BrandLogo } from "./BrandLogo";

export function LoadingView() {
  return (
    <div className="grid min-h-screen place-items-center manga-bg">
      <div className="rounded-2xl border border-manga-line bg-white/90 px-8 py-6 text-center shadow-soft">
        <BrandLogo size="lg" showText={false} className="mb-3 justify-center animate-pulse" />
        <p className="font-extrabold text-ink">Preparando IkasLab...</p>
      </div>
    </div>
  );
}
