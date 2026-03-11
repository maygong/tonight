"use client";

import { useState, useCallback, useRef } from "react";
import { FlowerBackground } from "@/components/FlowerBackground";
import { Phase1Input } from "@/components/Phase1Input";
import { Phase2Deck } from "@/components/Phase2Deck";
import { Phase3Result } from "@/components/Phase3Result";
import type { Combo } from "@/lib/constants";
import { comboToPills } from "@/lib/constants";

type Phase = "input" | "deck" | "reveal";
const TRANSITION_LINGER_MS = 500;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [combo, setCombo] = useState<Combo | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [deckResetSignal, setDeckResetSignal] = useState(0);
  const pendingGenerationRef = useRef<Promise<boolean> | null>(null);

  const generateIdea = useCallback(async (c: Combo): Promise<boolean> => {
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
        return false;
      }
      setResult(data.activity ?? "Something went wrong.");
      return true;
    } catch (e) {
      setResult(null);
      setApiError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleShuffle = useCallback((c: Combo) => {
    setCombo(c);
    setResult(null);
    setApiError(null);
    setDeckResetSignal((v) => v + 1);
    setPhase("deck");
    // API starts immediately when entering screen 2.
    pendingGenerationRef.current = generateIdea(c);
  }, [generateIdea]);

  const handlePickCard = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, TRANSITION_LINGER_MS));
    // Generation is expected to be done already; if not, wait briefly for it.
    if (!result && pendingGenerationRef.current) {
      await pendingGenerationRef.current;
      pendingGenerationRef.current = null;
    }
    setPhase("reveal");
  }, [result]);

  const handleRedraw = useCallback(() => {
    if (!combo) return;
    setResult(null);
    setApiError(null);
    setDeckResetSignal((v) => v + 1);
    setPhase("deck");
    // Re-roll immediately kicks off a fresh generation for step 2.
    pendingGenerationRef.current = generateIdea(combo);
  }, [combo, generateIdea]);

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
      <main className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-[9vh] pb-6 sm:pt-[11vh] sm:pb-8">
        <header className="text-center mb-7 sm:mb-9">
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
                  onPickCard={handlePickCard}
                  isGenerating={isGenerating}
                  apiError={apiError}
                  resetSignal={deckResetSignal}
                />
              )}

              {phase === "reveal" && (
                <Phase3Result
                  combo={combo}
                  result={result}
                  isGenerating={isGenerating}
                  apiError={apiError}
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
