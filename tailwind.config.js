/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screen: {
      xs: "475px",
      ...defaultTheme.screen,
    },
    extend: {
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
