import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { MODES, ENERGIES } from "@/lib/constants";

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const keyPreview = apiKey
    ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)} (length ${apiKey.length})`
    : "not set";
  console.log("[generate] ANTHROPIC_API_KEY:", keyPreview);

  if (!apiKey) {
    return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 500 });
  }

  let body: { mode?: string; energy?: string; me?: string; them?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { mode, energy, me, them } = body;
  const meVal = typeof me === "string" ? me.trim() : "";
  const themVal = typeof them === "string" ? them.trim() : "";
  if (!mode || !energy || (!meVal && !themVal)) {
    return NextResponse.json(
      { error: "Missing mode, energy, and at least one descriptor (me or them)" },
      { status: 400 }
    );
  }

  const modeLabel = MODES.find((m) => m.id === mode)?.label ?? mode;
  const energyLabel = ENERGIES.find((e) => e.id === energy)?.label ?? energy;

  const anthropic = new Anthropic({ apiKey });

  const systemPrompt = `You are a spontaneity coach for couples. Given a mode, energy level, and one or two short "vibe" words (one for each person if provided), you suggest ONE surprising, specific, evocative activity idea. Rules:
- Output exactly ONE activity idea, no list, no preamble.
- Keep it under 25 words.
- Be specific and evocative (e.g. not "watch a movie" but "pick a foreign film you've never heard of and guess the plot in the first ten minutes").
- Match the requested mode (Consume / Create / Explore / Connect) and energy (Chill / Moderate / High).
- Weave in the provided vibe word(s) naturally so the idea feels personal. If only one vibe word is provided, tailor the idea to that person.
- Reply with only the activity text, nothing else.`;

  const userParts: string[] = [`Mode: ${modeLabel}.`, `Energy: ${energyLabel}.`];
  if (meVal) userParts.push(`Vibe "Me": ${meVal}.`);
  if (themVal) userParts.push(`Vibe "Them": ${themVal}.`);
  const userMessage = userParts.join(" ");

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 120,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const activity =
      textBlock && "text" in textBlock
        ? (textBlock.text as string).trim().replace(/^["']|["']$/g, "")
        : null;

    if (!activity) {
      return NextResponse.json({ error: "No activity in response" }, { status: 500 });
    }

    return NextResponse.json({ activity });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    const isAuthError =
      message.toLowerCase().includes("api key") ||
      message.toLowerCase().includes("authentication") ||
      message.toLowerCase().includes("invalid_api_key") ||
      (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 401);

    console.error("[generate] Anthropic API error (full):", err);
    if (err && typeof err === "object") {
      if ("response" in err && err.response && typeof err.response === "object") {
        console.error("[generate] Error response:", JSON.stringify(err.response, null, 2));
      }
      if ("status" in err) console.error("[generate] Error status:", (err as { status: unknown }).status);
      if ("body" in err) console.error("[generate] Error body:", (err as { body: unknown }).body);
      if ("message" in err) console.error("[generate] Error message:", (err as { message: unknown }).message);
    }

    return NextResponse.json(
      {
        error: isAuthError
          ? "Invalid or missing API key. Add ANTHROPIC_API_KEY to .env.local and restart the dev server."
          : message,
      },
      { status: 500 }
    );
  }
}
