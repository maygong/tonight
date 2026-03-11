"use client";

import { useState } from "react";
import { MODES, ENERGIES, type Combo, type ModeId, type EnergyId } from "@/lib/constants";

const PANEL_CLASS =
  "rounded-2xl border border-ink/10 bg-white/60 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4";

export function Phase1Input({ onShuffle }: { onShuffle: (c: Combo) => void }) {
  const [mode, setMode] = useState<ModeId | null>(null);
  const [energy, setEnergy] = useState<EnergyId | null>(null);
  const [me, setMe] = useState("");
  const [them, setThem] = useState("");

  const hasAnyDescriptor = me.trim().length > 0 || them.trim().length > 0;
  const allFilled = mode !== null && energy !== null && hasAnyDescriptor;

  const handleShuffle = () => {
    if (!allFilled || mode === null || energy === null) return;
    onShuffle({ mode, energy, me: me.trim(), them: them.trim() });
  };

  return (
    <div className="w-full max-w-[460px] flex flex-col gap-6">
      {/* Mode — 2x2 grid */}
      <section className={PANEL_CLASS}>
        <p className="text-xs font-medium text-ink/60 uppercase tracking-wider mb-3">The Move</p>
        <div className="grid grid-cols-2 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`rounded-xl py-3 px-3 text-left transition-all border ${
                mode === m.id
                  ? "border-ink/30 bg-ink/5 text-ink"
                  : "border-ink/10 bg-white/40 text-ink/80 hover:border-ink/20"
              }`}
            >
              <span className="font-medium block text-sm">{m.label}</span>
              <span className="text-xs text-ink/60">{m.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Energy — row */}
      <section className={PANEL_CLASS}>
        <p className="text-xs font-medium text-ink/60 uppercase tracking-wider mb-3">Energy</p>
        <div className="flex gap-2">
          {ENERGIES.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setEnergy(e.id)}
              className={`flex-1 rounded-xl py-3 px-3 text-center font-medium text-sm transition-all border ${
                energy === e.id
                  ? "border-ink/30 bg-ink/5 text-ink"
                  : "border-ink/10 bg-white/40 text-ink/80 hover:border-ink/20"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </section>

      {/* Vibe descriptors */}
      <section className={PANEL_CLASS}>
        <p className="text-xs font-medium text-ink/60 uppercase tracking-wider mb-3">Ingredients</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-ink/60 block mb-1">Me</span>
            <input
              type="text"
              maxLength={20}
              value={me}
              onChange={(e) => setMe(e.target.value)}
              placeholder="e.g. free, red, nostalgic"
              className="w-full rounded-xl border border-ink/10 bg-white/60 px-3 py-2.5 text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/20"
            />
          </label>
          <label className="block">
            <span className="text-xs text-ink/60 block mb-1">Them</span>
            <input
              type="text"
              maxLength={20}
              value={them}
              onChange={(e) => setThem(e.target.value)}
              placeholder="e.g. rooftop, jazz, adventure"
              className="w-full rounded-xl border border-ink/10 bg-white/60 px-3 py-2.5 text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/20"
            />
          </label>
        </div>
      </section>

      {/* Draw a card */}
      <button
        type="button"
        onClick={handleShuffle}
        disabled={!allFilled}
        className={`rounded-2xl py-4 px-6 font-medium text-ink transition-all border ${
          allFilled
            ? "bg-ink/10 text-ink border-ink/20 hover:bg-ink/15 active:scale-[0.98]"
            : "bg-ink/5 text-ink/40 border-ink/10 cursor-not-allowed"
        }`}
      >
        Draw a card
      </button>
    </div>
  );
}
