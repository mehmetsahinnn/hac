import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#202020",
        "dark-shale": "#4d4d4d",
        "silver-ash": "#828282",
        "light-pearl": "#e8e8e8",
        "warm-ivory": "#ebe6dd",
        "slate-mist": "#efefef",
        "cloud-whisper": "#f5f5f5",
        "canvas-white": "#ffffff",
        "sunset-orange": "#ff682c",
        "data-gold": "#816729",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Montserrat", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        caption: ["12px", { lineHeight: "1.5" }],
        body: ["15px", { lineHeight: "1.33" }],
        subheading: ["18px", { lineHeight: "1.25" }],
        "heading-sm": ["32px", { lineHeight: "1.19", letterSpacing: "-0.64px" }],
        heading: ["40px", { lineHeight: "1.13", letterSpacing: "-0.8px" }],
        display: ["66px", { lineHeight: "0.91", letterSpacing: "-1.32px" }],
      },
      spacing: {
        "4.5": "18px",
        "5.5": "22px",
      },
      borderRadius: {
        cards: "8px",
        large: "20px",
        inputs: "20px",
        buttons: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
