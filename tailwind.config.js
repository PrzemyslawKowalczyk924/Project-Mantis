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
        'navy-middleBlue': '#505F98',
        'navy-strongBlue': '#1A3C73',
      },
      borderRadius: {
        'borderRadiusForShip': '41% 32% 25% 36% / 55% 0% 0% 32%',
      },
      backgroundSize: {
        '50%': '50%',
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}

