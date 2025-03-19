/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: "class",

  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    extend: {

      gridTemplateColumns: {
        '20': 'repeat(20, minmax(0, 1fr))'
      },
      borderRadius: {
        '4xl': '2rem',
      },
   
      colors: {
        primary: {
          "100": "#D3E6FE",
          "200": "#A7CAFD",
          "300": "#7BAAF9",
          "400": "#598EF3",
          "500": "#2563EB",
          "600": "#1B4CCA",
          "700": "#1238A9",
          "800": "#0B2688",
          "900": "#071A70",
        }


      },
    },
    corePlugins: {
      aspectRatio: false,
    },
    plugins: [
      require("@tailwindcss/aspect-ratio"),
      require("@tailwindcss/forms"),
      require("@tailwindcss/typography"),
    ],
  },
}