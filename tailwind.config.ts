import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Warm PostHog desktop palette (DESIGN.md) ---
        "desktop-beige": "#e1d7c2",
        "browser-white": "#ffffff",
        "cream-paper": "#fdfdf8",
        linen: "#eeefe9",
        "fog-khaki": "#e5e7e0",
        "ash-border": "#d2d3cc",
        sage: "#bfc1b7",
        moss: "#9ea096",
        olive: "#65675e",
        "dark-olive": "#4d4f46",
        bark: "#23251d",
        ink: "#111827",
        amber: "#f1a82c",
        "amber-deep": "#eb9d2a",
        "amber-shadow": "#cd8407",
        saffron: "#b17816",
        cobalt: "#2f80fa",
        ember: "#f54e00",
        fern: "#6aa84f",

        // --- Legacy token names, remapped to warm equivalents so existing
        //     component classes keep working with the new cozy theme ---
        midnight: "#23251d",
        "dark-shale": "#4d4f46",
        "silver-ash": "#9ea096",
        "light-pearl": "#e3ddcc",
        "warm-ivory": "#f6edd6",
        "slate-mist": "#f4eee1",
        "cloud-whisper": "#efe7d6",
        "canvas-white": "#ffffff",
        "sunset-orange": "#f54e00",
        "data-gold": "#b17816",
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["'IBM Plex Sans'", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'Source Code Pro'", "ui-monospace", "monospace"],
      },
      fontSize: {
        caption: ["12px", { lineHeight: "1.5", letterSpacing: "-0.025em" }],
        body: ["15px", { lineHeight: "1.5", letterSpacing: "-0.025em" }],
        subheading: ["18px", { lineHeight: "1.4", letterSpacing: "-0.025em" }],
        "heading-sm": ["24px", { lineHeight: "1.25", letterSpacing: "-0.03em" }],
        heading: ["32px", { lineHeight: "1.2", letterSpacing: "-0.03em" }],
        display: ["44px", { lineHeight: "1.1", letterSpacing: "-0.035em" }],
      },
      spacing: {
        "4.5": "18px",
        "5.5": "22px",
      },
      borderRadius: {
        cards: "12px",
        large: "16px",
        inputs: "10px",
        buttons: "10px",
      },
      boxShadow: {
        window: "rgba(60, 45, 20, 0.18) 0px 24px 48px -16px",
        soft: "rgba(60, 45, 20, 0.06) 0px 2px 8px -2px",
      },
    },
  },
  plugins: [],
};

export default config;
