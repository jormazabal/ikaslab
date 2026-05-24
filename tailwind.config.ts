import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18202c",
        manga: {
          paper: "#f7f8fb",
          panel: "#ffffff",
          line: "#dbe3ee",
          ink: "#18202c",
          muted: "#607086",
          cyan: "#22d3ee",
          coral: "#ff6f61",
          violet: "#7c3aed",
          amber: "#f59e0b",
        },
        panda: {
          blush: "#ffe3e0",
          mint: "#dff8f4",
          sky: "#e3f5ff",
          gold: "#fff0c2",
          coral: "#ff6f61",
          leaf: "#22a6b3",
          night: "#263142",
        },
      },
      boxShadow: {
        soft: "0 16px 42px rgba(24, 32, 44, 0.10)",
        button: "0 6px 16px rgba(255, 111, 97, 0.24)",
      },
      fontFamily: {
        display: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
