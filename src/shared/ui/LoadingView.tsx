export function LoadingView() {
  return (
    <div className="grid min-h-screen place-items-center panda-bg">
      <div className="rounded-3xl bg-white/80 px-8 py-6 text-center shadow-soft">
        <div className="mx-auto mb-3 h-12 w-12 animate-bounce rounded-2xl bg-panda-mint text-3xl">
          🐼
        </div>
        <p className="font-extrabold text-ink">Preparando IkasLab...</p>
      </div>
    </div>
  );
}
