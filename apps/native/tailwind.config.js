/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        alert: "#F43F5E",
        background: "#F8FAFC",
        primary: "#0D9488",
        secondary: "#3B82F6",
        success: "#10B981",
        surface: "#FFFFFF",
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
        },
      },
      boxShadow: {
        card: "0 6px 16px rgba(15, 23, 42, 0.06)",
      },
      fontFamily: {
        sans: ["Inter", "System"],
      },
    },
  },
  plugins: [],
};
