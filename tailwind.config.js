/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        adoGreen: "#0b6e4f",
        adoYellow: "#f2c200",
      },
    },
  },
  plugins: [],
};
