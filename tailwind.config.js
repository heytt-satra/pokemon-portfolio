/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gb: {
          lightest: "#E0F0A0",
          light: "#9BBC0F",
          mid: "#8BAC0F",
          dark: "#306230",
          darkest: "#0F380F",
        },
        pokemon: {
          red: "#CC0000",
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      spacing: {
        'screen-w': '240px',
        'screen-h': '216px',
      }
    },
  },
  plugins: [],
}
