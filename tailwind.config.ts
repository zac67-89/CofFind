import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cafe-cream": "#FAF7F2",
        "cafe-surface": "#FFFFFF",
        "cafe-warm-bg": "#F5EFE6",
        "cafe-border": "#EFE6DC",
        "cafe-border-hover": "#D8C7B5",
        "cafe-espresso": "#2D2118",
        "cafe-hazelnut": "#6E5C50",
        "cafe-muted": "#6E5C50",
        "cafe-caramel": "#8C532B",
        "cafe-caramel-hover": "#744320",
        "cafe-terracotta": "#C8753B",
        "cafe-green": "#2E7D32",
        "cafe-green-bg": "#E8F5E9",
      },
      borderRadius: {
        card: "16px",
        ghost: "20px",
        pill: "9999px",
      },
      transitionTimingFunction: {
        emil: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      boxShadow: {
        cafe: "0 2px 10px -2px rgba(45, 33, 24, 0.05), 0 1px 3px -1px rgba(45, 33, 24, 0.04)",
        "cafe-hover": "0 10px 25px -4px rgba(45, 33, 24, 0.08), 0 4px 8px -2px rgba(45, 33, 24, 0.04)",
        "cafe-modal": "0 20px 40px -8px rgba(45, 33, 24, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
