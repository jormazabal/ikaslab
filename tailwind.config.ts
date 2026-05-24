import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#26323d",
        panda: {
          blush: "#ffe0ea",
          mint: "#d7f7e7",
          sky: "#dff2ff",
          gold: "#ffe8a8",
          coral: "#ff8d7c",
          leaf: "#52b788",
          night: "#364153",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(54, 65, 83, 0.14)",
        button: "0 8px 0 rgba(54, 65, 83, 0.14)",
      },
      fontFamily: {
        display: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
