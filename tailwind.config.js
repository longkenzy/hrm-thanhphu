/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#DF301C",
          primary: "#DF301C",
          hover: "#C52714",
          light: "#FDF2F0",
          accent: "#FF9100",
          cream: "#FFF1D1",
          cyan: "#00B7CD",
          cyanHover: "#009EAF",
          dark: "#1A1A1A",
          gray: "#555555",
          border: "#E0E0E0",
          bg: "#F7F8FA",
        },
      },
      borderRadius: {
        DEFAULT: "3px",
        sm: "2px",
        md: "3px",
        lg: "4px",
        xl: "4px",
      },
      fontFamily: {
        sans: ["'Roboto'", "sans-serif"],
        roboto: ["'Roboto'", "sans-serif"],
      },
      boxShadow: {
        flat: "0 1px 2px rgba(0, 0, 0, 0.05)",
        none: "none",
      },
    },
  },
  plugins: [],
}
