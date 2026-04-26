/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        alert: "#F43F5E",
        background: "#F8FAFC",
        border: "#E2E8F0",
        primary: "#0D9488",
        ringBad: "#F43F5E",
        ringSoon: "#F59E0B",
        secondary: "#3B82F6",
        success: "#10B981",
        surface: "#FFFFFF",
        text: "#0F172A",
        textMuted: "#64748B",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      fontFamily: {
        body: ["Inter_400Regular"],
        heading: ["Inter_600SemiBold"],
        label: ["Inter_500Medium"],
      },
    },
  },
  plugins: [],
};
