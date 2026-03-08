/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        splat: {
          pink: '#ec1d7c',
          green: '#8fd131',
          blue: '#1942d8',
          yellow: '#dff619',
          orange: '#f28322',
          purple: '#6d2bb8',
          dark: '#1a1a1a',
          black: '#0d0d0d',
        }
      },
      fontFamily: {
        splatoon: ['"M PLUS Rounded 1c"', '"Yusei Magic"', "sans-serif"],
      }
    },
  },
  plugins: [],
}
