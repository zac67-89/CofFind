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
        "walnut-shadow": "#100904",
        "warm-cream": "#ffedd7",
        "bark-brown": "#382416",
        "cork-border": "#40372e",
        driftwood: "#6c5f51",
        "ember-accent": "#dc5000",
        "pure-black": "#000000",
      },
      borderRadius: {
        card: "12px",
        ghost: "22.5px",
        pill: "36px",
      },
      transitionTimingFunction: {
        emil: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
