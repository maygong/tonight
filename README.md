# Tonight

A spontaneity engine for couples — pick a mode, energy, and vibes, shuffle the deck, and get one surprising activity idea :D

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.local.example` to `.env.local` and add your Anthropic API key:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:

   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

3. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

- Push to GitHub and import the repo in Vercel, or use the Vercel CLI.
- In the project settings, add the environment variable **ANTHROPIC_API_KEY** (from your Anthropic account).
- Deploy; the app uses the existing `vercel.json` and Next.js config.

## Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Anthropic API (Claude) for activity generation
