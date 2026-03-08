"use client";

import { useState, useCallback } from "react";
import { FlowerBackground } from "@/components/FlowerBackground";
import { Phase1Input } from "@/components/Phase1Input";
import { Phase2Deck } from "@/components/Phase2Deck";
import { Phase3Result } from "@/components/Phase3Result";
import type { Combo } from "@/lib/constants";
import { comboToPills } from "@/lib/constants";

type Phase = "input" | "deck" | "reveal";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [combo, setCombo] = useState<Combo | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [deckResetSignal, setDeckResetSignal] = useState(0);

  const handleShuffle = useCallback((c: Combo) => {
    setCombo(c);
    setResult(null);
    setApiError(null);
    setDeckResetSignal((v) => v + 1);
    setPhase("deck");
  }, []);

  const handleDrawCard = useCallback(async (c: Combo): Promise<boolean> => {
    setIsGenerating(true);
    setApiError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult(null);
        setApiError(data?.error ?? `Request failed (${res.status})`);
        setDeckResetSignal((v) => v + 1);
        return false;
      }
      setResult(data.activity ?? "Something went wrong.");
      setPhase("reveal");
      return true;
    } catch (e) {
      setResult(null);
      setApiError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setDeckResetSignal((v) => v + 1);
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleRedraw = useCallback(() => {
    setResult(null);
    setApiError(null);
    setDeckResetSignal((v) => v + 1);
    setPhase("deck");
  }, []);

  const handleStartOver = useCallback(() => {
    setCombo(null);
    setResult(null);
    setApiError(null);
    setDeckResetSignal((v) => v + 1);
    setPhase("input");
  }, []);

  return (
    <>
      <FlowerBackground />
      <main className="relative z-10 min-h-screen flex flex-col items-center px-4 py-6 sm:py-8">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">tonight</h1>
          <p className="font-sans text-sm text-ink/70 mt-0.5">let&apos;s go on a different date</p>
        </header>

        <div className="w-full max-w-[460px] flex flex-col gap-8">
          {phase === "input" && <Phase1Input onShuffle={handleShuffle} />}

          {phase !== "input" && combo && (
            <>
              <div className="flex flex-wrap justify-center gap-2">
                {comboToPills(combo).map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-ink/8 border border-ink/10 px-3 py-1 text-sm text-ink/90"
                  >
                    {p}
                  </span>
                ))}
              </div>

              {phase === "deck" && (
                <Phase2Deck
                  combo={combo}
                  onDrawCard={handleDrawCard}
                  isGenerating={isGenerating}
                  apiError={apiError}
                  resetSignal={deckResetSignal}
                />
              )}

              {phase === "reveal" && result && (
                <Phase3Result
                  combo={combo}
                  result={result}
                  onRedraw={handleRedraw}
                  onStartOver={handleStartOver}
                  showPills={false}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
