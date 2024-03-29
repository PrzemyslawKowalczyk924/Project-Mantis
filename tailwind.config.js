/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#C5E7F1',
      },
      borderRadius: {
        'borderRadiusForShip': '41% 32% 25% 36% / 55% 0% 0% 32%',
      },
      backgroundSize: {
        '50%': '50%',
      }
    },
  },
  plugins: [],
}

