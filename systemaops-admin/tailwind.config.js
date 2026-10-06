/** SystemaOps Admin — restrained operations palette (teal brand accent). */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effafa",
          100: "#d7f1f1",
          200: "#b0e3e3",
          600: "#159a9c",
          700: "#0e6f70",
          800: "#0c5e5f",
        },
        ink: {
          50: "#f7f9fc",
          100: "#f1f5f8",
          200: "#e2e8f0",
          300: "#d7e0e8",
          500: "#64748b",
          700: "#334155",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Space Grotesk'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
