"use client";

import { useState } from "react";
import { comboToPills, type Combo } from "@/lib/constants";

const PANEL_CLASS = "rounded-2xl border border-ink/10 bg-white/60 backdrop-blur-md";

export function Phase3Result({
  combo,
  result,
  isGenerating,
  apiError,
  onRedraw,
  onStartOver,
  showPills = true,
}: {
  combo: Combo;
  result: string | null;
  isGenerating: boolean;
  apiError: string | null;
  onRedraw: () => void;
  onStartOver: () => void;
  showPills?: boolean;
}) {
  const [confirmState, setConfirmState] = useState<"idle" | "confirming" | "done">("idle");
  const [revealed, setRevealed] = useState(false);

  const pills = comboToPills(combo);

  const handleLetsDoIt = () => {
    if (confirmState === "idle") {
      setConfirmState("confirming");
      setTimeout(() => setConfirmState("done"), 1200);
    }
  };

  return (
    <div className="w-full max-w-[460px] flex flex-col items-center">
      {showPills && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {pills.map((p) => (
            <span
              key={p}
              className="rounded-full bg-ink/8 border border-ink/10 px-3 py-1 text-sm text-ink/90"
            >
              {p}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (!result) return;
          setRevealed(true);
        }}
        disabled={revealed || !result}
        className="w-full mb-8 [perspective:1200px] animate-cinematic-in"
      >
        <div
          className={`relative h-[240px] sm:h-[280px] w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            revealed ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-ink/20 bg-[#2d2d2d] shadow-xl flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-sheen-pass" />
            <div className="text-center text-cream/85">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full border border-cream/30 flex items-center justify-center">
                ✦
              </div>
              <p className="text-sm">Tap to reveal your card</p>
            </div>
          </div>

          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-[#1a1a1a] text-cream p-6 sm:p-8 shadow-xl border border-ink/10 flex items-center justify-center">
            <p className="font-serif text-xl sm:text-2xl leading-relaxed text-center">
              {result ?? ""}
            </p>
          </div>
        </div>
      </button>

      {apiError && (
        <div className="mb-4 w-full rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 w-full">
        <button
          type="button"
          onClick={onRedraw}
          className={`w-full ${PANEL_CLASS} py-3 px-2 font-medium text-xs sm:text-sm text-ink hover:bg-white/80 transition-colors active:scale-[0.99]`}
        >
          Re-draw
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className={`w-full ${PANEL_CLASS} py-3 px-2 font-medium text-xs sm:text-sm text-ink hover:bg-white/80 transition-colors active:scale-[0.99]`}
        >
          Start Over
        </button>
        <button
          type="button"
          onClick={handleLetsDoIt}
          disabled={!result || !revealed}
          className={`w-full rounded-2xl py-3 px-2 font-medium text-xs sm:text-sm transition-all border border-ink/20 ${
            !result || !revealed
              ? "bg-ink/10 text-ink/40 border-ink/10 cursor-not-allowed"
              : confirmState === "done"
              ? "bg-green-600/20 text-green-800 border-green-400/40"
              : confirmState === "confirming"
                ? "bg-ink/10 text-ink animate-pulse"
                : "bg-ink text-cream border-ink hover:bg-ink/90 active:scale-[0.99]"
          }`}
        >
          {confirmState === "idle" && "Let's do it"}
          {confirmState === "confirming" && "…"}
          {confirmState === "done" && "✓ Let's do it"}
        </button>
      </div>
    </div>
  );
}
