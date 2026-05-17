/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        alert: "#F43F5E",
        background: "#F1ECE0",
        primary: "#0F6B61",
        secondary: "#3B82F6",
        success: "#10B981",
        surface: "#FFFFFF",
        text: {
          primary: "#0F1F1B",
          secondary: "#6B7771",
        },
      },
      boxShadow: {
        card: "0 6px 16px rgba(15, 23, 42, 0.06)",
      },
      fontFamily: {
        sans: ["Geist", "System"],
        serif: ["InstrumentSerif", "serif"],
      },
    },
  },
  plugins: [],
};
