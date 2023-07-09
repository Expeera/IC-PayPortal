/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./frontend/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontWeight: {
      hairline: 100,
      "extra-light": 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      "extra-bold": 800,
      black: 900,
    },
    fontFamily: {
      display: ["Inter", "Source Serif Pro", "Georgia", "serif"],
      body: ["Inter", "Synonym", "system-ui", "sans-serif"],
    },

    colors: {
      ...colors,
      transparent: "transparent",
      current: "currentColor",
      primary: "#199B45",
      secondary: "#C4DF2B",
      neutral: colors.gray,
      custom: colors.red,
      label: "#B1B5C4",
      accent: "#F4F2F9",
      blackText: "#131117",
      theme: '#2A2B31',
      backGround : '#18191D',

    },
    extend: {
      backgroundImage: {
        box: "url('../frontend/assets/box.svg')",
      },
    },
  },
  plugins: [],
}
