"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "idle" | "running" | "stopped";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState(0);

  const phaseRef = useRef<Phase>("idle");
  const startRef = useRef(0);

  const activate = useCallback(() => {
    if (phaseRef.current === "running") {
      const duration = Date.now() - startRef.current;

      phaseRef.current = "stopped";
      setPhase("stopped");
      setElapsed(duration);
      setResult(duration);
      return;
    }

    phaseRef.current = "running";
    startRef.current = Date.now();
    setPhase("running");
    setElapsed(0);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (
        event.target instanceof Element &&
        event.target.closest("a") &&
        (event.key === "Enter" || event.key === " ")
      ) {
        return;
      }
      activate();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("a")) return;
      activate();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [activate]);

  useEffect(() => {
    if (phase !== "running") return;

    const id = window.setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 50);

    return () => window.clearInterval(id);
  }, [phase]);

  return (
    <main className="relative flex min-h-dvh flex-1 cursor-pointer touch-manipulation select-none flex-col items-center justify-center overscroll-none bg-black px-6 text-center font-sans">
      {phase === "idle" && (
        <p className="stage flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500 sm:text-xs md:text-sm">
          <span>Press</span>
          <kbd className="keycap">any key</kbd>
          <span>or touch the screen to start playing nothing</span>
        </p>
      )}

      {phase === "running" && (
        <div className="stage flex flex-col items-center gap-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-600">
            you are doing nothing since
          </span>
          <span className="text-6xl font-light tabular-nums tracking-tight text-zinc-100 sm:text-7xl md:text-8xl">
            {formatTime(elapsed)}
          </span>
        </div>
      )}

      {phase === "stopped" && (
        <div className="stage flex max-w-xl flex-col items-center gap-5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            You did something.
          </h1>
          <p className="text-sm tracking-wide text-zinc-500 sm:text-base">
            You were doing nothing for{" "}
            <span className="font-semibold tabular-nums text-zinc-200">
              {formatTime(result)}
            </span>
            .
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 pt-1 text-[10px] uppercase tracking-[0.3em] text-zinc-500 sm:text-xs">
            <span>Press</span>
            <kbd className="keycap">any key</kbd>
            <span>or touch the screen again to start playing nothing</span>
          </p>
        </div>
      )}

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-zinc-600">
        Ragebaited by{" "}
        <a
          href="https://huzaifa-lake.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-100 hover:underline"
        >
          Huzaifa
        </a>
      </p>
    </main>
  );
}
