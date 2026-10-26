import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand palette
        litl: {
          blue: {
            DEFAULT: "#0B3D91", // primary blue
            light: "#1E5BC6",
            dark: "#072B67",
          },
          gold: {
            DEFAULT: "#D4A017", // supporting gold
            light: "#E6B948",
            dark: "#A67C0F",
          },
          wine: {
            DEFAULT: "#7B1E3A", // supporting wine
            light: "#9C2A4F",
            dark: "#5A152A",
          },
          // Neutrals
          white: "#FFFFFF",
          cream: "#F7F4EC",
          ink: "#0F172A",
          muted: "#475569",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        litl: "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;