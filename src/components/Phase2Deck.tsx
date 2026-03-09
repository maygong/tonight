"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { Combo } from "@/lib/constants";

const CARD_COUNT = 12;
const ANGLE_PER_CARD = 6;
const CARD_WIDTH = 88;
const CARD_HEIGHT = 124;
const DRAG_SENSITIVITY = 1.65;
const SNAP_OPEN_THRESHOLD = 28;

export function Phase2Deck({
  combo,
  onDrawCard,
  isGenerating,
  apiError,
  resetSignal,
}: {
  combo: Combo;
  onDrawCard: (c: Combo) => Promise<boolean>;
  isGenerating: boolean;
  apiError: string | null;
  resetSignal: number;
}) {
  const [fanOffset, setFanOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const deckRef = useRef<HTMLDivElement>(null);
  const didDrag = useRef(false);

  const maxFan = 120;
  const clampFan = (v: number) => Math.min(maxFan, Math.max(0, v));

  useEffect(() => {
    setSelectedIndex(null);
    didDrag.current = false;
  }, [resetSignal]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (selectedIndex !== null || isGenerating) return;
      didDrag.current = false;
      startX.current = e.clientX;
      startOffset.current = fanOffset;
      setIsDragging(true);
      deckRef.current?.setPointerCapture?.(e.pointerId);
    },
    [fanOffset, selectedIndex, isGenerating]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX.current;
      if (Math.abs(dx) > 8) didDrag.current = true;
      setFanOffset(clampFan(startOffset.current + dx * DRAG_SENSITIVITY));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setFanOffset((prev) => (prev >= SNAP_OPEN_THRESHOLD ? maxFan : 0));
    setIsDragging(false);
  }, [maxFan]);

  const handleCardClick = useCallback(
    async (index: number) => {
      if (isGenerating || selectedIndex !== null || didDrag.current) return;
      if (fanOffset < 16) return;
      setSelectedIndex(index);
      const ok = await onDrawCard(combo);
      if (!ok) {
        setSelectedIndex(null);
      }
    },
    [combo, fanOffset, onDrawCard, isGenerating, selectedIndex]
  );

  const t = fanOffset / maxFan;
  const totalSpreadDeg = 20 + t * (CARD_COUNT - 1) * ANGLE_PER_CARD;

  return (
    <div className="w-full flex flex-col items-center">
      {apiError && (
        <div className="mb-4 w-full rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {apiError}
        </div>
      )}

      <div
        ref={deckRef}
        className="relative w-full flex justify-center items-end min-h-[220px]"
      >
        <div
          className="absolute left-1/2 bottom-0 flex justify-center items-end touch-none"
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            transform: "translateX(-50%)",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {Array.from({ length: CARD_COUNT }).map((_, i) => {
            const normalizedIndex = CARD_COUNT > 1 ? i / (CARD_COUNT - 1) : 0.5;
            const angleDeg = -totalSpreadDeg / 2 + normalizedIndex * totalSpreadDeg;
            const isSelected = selectedIndex === i;
            const isDimmed = selectedIndex !== null && selectedIndex !== i;
            const cardTransform = isSelected
              ? `rotate(${angleDeg}deg) translateY(-24px) scale(1.13) translateZ(0)`
              : `rotate(${angleDeg}deg) translateZ(0)`;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleCardClick(i)}
                disabled={isGenerating || selectedIndex !== null || fanOffset < 16}
                className="absolute transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ink/30 focus:ring-offset-2 focus:ring-offset-cream"
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  transformOrigin: "50% 100%",
                  transform: cardTransform,
                  zIndex: isSelected ? 100 : i,
                  opacity: isDimmed ? 0.16 : 1,
                  filter: isDimmed ? "blur(0.8px)" : "none",
                  boxShadow: isSelected
                    ? "0 18px 30px rgba(0,0,0,0.24)"
                    : "0 6px 10px rgba(0,0,0,0.15)",
                }}
              >
                <CardBack />
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-ink/60 mt-4 text-center">
        {isGenerating ? "Drawing your card..." : "Swipe and pick"}
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
