export const MODES = [
  { id: "consume", label: "Consume", sub: "watch·eat·listen·absorb" },
  { id: "create", label: "Create", sub: "make·build·draw·cook" },
  { id: "explore", label: "Explore", sub: "go·discover·wander" },
  { id: "connect", label: "Connect", sub: "talk·play·share" },
] as const;

export const ENERGIES = [
  { id: "chill", label: "Chill" },
  { id: "moderate", label: "Moderate" },
  { id: "high", label: "High" },
] as const;

export type ModeId = (typeof MODES)[number]["id"];
export type EnergyId = (typeof ENERGIES)[number]["id"];

export interface Combo {
  mode: ModeId;
  energy: EnergyId;
  me: string;
  them: string;
}

export function comboToPills(combo: Combo): string[] {
  const modeLabel = MODES.find((m) => m.id === combo.mode)?.label ?? combo.mode;
  const energyLabel = ENERGIES.find((e) => e.id === combo.energy)?.label ?? combo.energy;
  const pills = [modeLabel, energyLabel];
  if (combo.me?.trim()) pills.push(combo.me.trim());
  if (combo.them?.trim()) pills.push(combo.them.trim());
  return pills;
}
