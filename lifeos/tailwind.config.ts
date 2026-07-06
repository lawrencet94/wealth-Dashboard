import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#fcfcfb", dark: "#1a1a19" },
        plane: { DEFAULT: "#f9f9f7", dark: "#0d0d0d" },
        ink: {
          DEFAULT: "#0b0b0b",
          secondary: "#52514e",
          muted: "#898781",
          "dark-primary": "#ffffff",
          "dark-secondary": "#c3c2b7",
        },
        hairline: { DEFAULT: "#e1e0d9", dark: "#2c2c2a" },
        series: { DEFAULT: "#2a78d6", dark: "#3987e5" },
        good: "#0ca30c",
        warn: "#fab219",
        critical: "#d03b3b",
      },
    },
  },
  plugins: [],
};
export default config;
