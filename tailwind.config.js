/** @type {import('tailwindcss').Config} */
const animatePlugin = require("tailwindcss-animate");
const scrollbarHide = require("tailwind-scrollbar-hide");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          soft: "hsl(var(--secondary-soft))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        luxury: {
          gold: "hsl(var(--luxury-gold))",
        },
        wellness: {
          green: "hsl(var(--wellness-green))",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(var(--gradient-primary))",
        "gradient-secondary": "linear-gradient(var(--gradient-secondary))",
        "gradient-hero": "linear-gradient(var(--gradient-hero))",
        "gradient-elegant": "linear-gradient(var(--gradient-elegant))",
      },
      boxShadow: {
        soft: "0 4px 6px var(--shadow-soft)",
        elegant: "0 8px 16px var(--shadow-elegant)",
        luxury: "0 10px 20px var(--shadow-luxury)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        gentle: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "scale-gentle": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        // 🔹 New gradient animation
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "scale-gentle": "scale-gentle 0.3s ease-out",
        // 🔹 New gradient animation utility
        gradientMove: "gradientMove 4s ease infinite",
      },
    },
  },
  plugins: [animatePlugin, scrollbarHide],
};
