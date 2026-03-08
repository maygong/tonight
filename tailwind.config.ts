import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#faf8f4",
        ink: "#1a1a1a",
        "flower-orange": "#e07a5f",
        "flower-yellow": "#f2cc8f",
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "sway-slow": "sway 9s ease-in-out infinite",
        "sway-medium": "sway 8s ease-in-out infinite",
        "sway-fast": "sway 7s ease-in-out infinite",
        "sway-slower": "sway 11s ease-in-out infinite",
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-8deg)" },
          "50%": { transform: "rotate(8deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
