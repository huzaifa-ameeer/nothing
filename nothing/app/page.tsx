export default function Home() {
  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-black px-6">
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-center font-sans text-[11px] uppercase tracking-[0.3em] text-zinc-500 sm:text-xs md:text-sm">
        <span>Press</span>
        <kbd className="keycap">any key</kbd>
        <span>or touch the screen to start playing nothing</span>
      </p>
    </main>
  );
}
