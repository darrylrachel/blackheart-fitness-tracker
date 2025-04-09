/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: '#2c3e50',
        slate: '#34495e',
        green: '#27ae60',
        red: '#e74c3c',
        lightGray: '#ecf0f1',
      },
    },
  },
  plugins: [typography],

}
