"use client";

import { useEffect, useState } from "react";

const CARD_WIDTH = 92;
const CARD_HEIGHT = 132;
const FAN_LAYOUT = [
  { x: -84, y: 11, rot: -16 },
  { x: -56, y: 7, rot: -10 },
  { x: -28, y: 3, rot: -5 },
  { x: 0, y: 0, rot: 0 },
  { x: 28, y: 3, rot: 5 },
  { x: 56, y: 7, rot: 10 },
  { x: 84, y: 11, rot: 16 },
] as const;

type DeckStep = "stacked" | "fanned";

export function Phase2Deck({
  onPickCard,
  isGenerating,
  apiError,
  resetSignal,
}: {
  onPickCard: () => Promise<void> | void;
  isGenerating: boolean;
  apiError: string | null;
  resetSignal: number;
}) {
  const [step, setStep] = useState<DeckStep>("stacked");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setStep("stacked");
    setSelectedIndex(null);
  }, [resetSignal]);

  function handleOpenDeck() {
    if (step !== "stacked") return;
    setStep("fanned");
  }

  async function handlePickCard(index: number) {
    if (step !== "fanned" || selectedIndex !== null) return;
    setSelectedIndex(index);
    await onPickCard();
  }

  return (
    <div className="w-full flex flex-col items-center">
      {apiError && (
        <div className="mb-4 w-full rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {apiError}
        </div>
      )}

      <div className="relative w-full min-h-[260px]">
        {step === "stacked" && (
          <button
            type="button"
            onClick={handleOpenDeck}
            className="absolute left-1/2 bottom-8 -translate-x-1/2 h-[184px] w-[210px] focus:outline-none focus:ring-2 focus:ring-ink/30 focus:ring-offset-2 focus:ring-offset-cream"
            style={{ minHeight: 44, minWidth: 44 }}
          >
            <div className="absolute inset-0">
              {FAN_LAYOUT.map((card, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    transform: `translate(-50%, -50%) translate(${card.x * 0.2}px, ${card.y * 0.5}px) rotate(${card.rot * 0.24}deg)`,
                    zIndex: i + 1,
                  }}
                >
                  <CardBack />
                </div>
              ))}
            </div>
          </button>
        )}

        {step === "fanned" && (
          <div className="absolute inset-0">
            {FAN_LAYOUT.map((card, i) => {
              const isSelected = selectedIndex === i;
              const isOther = selectedIndex !== null && selectedIndex !== i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePickCard(i)}
                  disabled={selectedIndex !== null}
                  className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-ink/30 focus:ring-offset-2 focus:ring-offset-cream hover:-translate-y-[calc(50%+6px)] hover:shadow-xl active:scale-95"
                  style={{
                    minHeight: 44,
                    minWidth: 44,
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    transform: isSelected
                      ? "translate(-50%, -50%) translateY(-52px) scale(1.2)"
                      : `translate(-50%, -50%) translate(${card.x}px, ${card.y}px) rotate(${card.rot}deg)`,
                    opacity: isOther ? 0.08 : 1,
                    zIndex: isSelected ? 40 : i + 1,
                  }}
                >
                  <CardBack />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-sm text-ink/60 mt-4 text-center">
        {"Pick a card"}
      </p>
    </div>
  );
}

function CardBack() {
  return (
    <div className="w-full h-full rounded-lg bg-[#2d2d2d] border-2 border-amber-200/50 shadow-md flex items-center justify-center overflow-hidden ring-1 ring-black/20">
      <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#e07a5f]" fill="currentColor">
        <path d="M20,4 L20,16 Q24,18 22,14 Q22,8 20,4 Z" />
        <path d="M20,4 L20,16 Q16,18 18,14 Q18,8 20,4 Z" transform="rotate(72 20 10)" />
        <path d="M20,4 L20,16 Q16,18 18,14 Q18,8 20,4 Z" transform="rotate(144 20 10)" />
        <path d="M20,4 L20,16 Q16,18 18,14 Q18,8 20,4 Z" transform="rotate(216 20 10)" />
        <path d="M20,4 L20,16 Q16,18 18,14 Q18,8 20,4 Z" transform="rotate(288 20 10)" />
        <circle cx="20" cy="12" r="3" fill="#f2cc8f" />
      </svg>
    </div>
  );
}
