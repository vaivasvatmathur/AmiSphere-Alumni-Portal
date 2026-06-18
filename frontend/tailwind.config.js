/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"]
      },
      colors: {
        brand: {
          50: "#eef3f8",
          100: "#d9e4ef",
          300: "#8aa2bd",
          500: "#173f6b",
          600: "#0f3158",
          700: "#0b2545",
          900: "#061a32"
        },
        gold: {
          50: "#fff8e3",
          100: "#ffefbd",
          400: "#f5c542",
          500: "#d9a514",
          600: "#b8850c"
        }
      },
      boxShadow: {
        soft: "0 16px 40px rgba(15, 23, 42, 0.08)",
        panel: "0 24px 64px rgba(15, 23, 42, 0.12)"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: []
};
