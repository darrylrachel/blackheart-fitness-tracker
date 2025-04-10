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
        primary: '#bfa85d', // darkBlue: '#2c3e50',
        primaryDark: '#a48f4e',
        dark: '#282829',  // slate: '#34495e',
        balticSea: '#3d3d3d',
        gray: '#7a7a7a',  // green: '#27ae60',
        flat: '#171a21',
        light: '#f4f1e6',  // 
        lightGray: '#ecf0f1',
        red: '#e74c3c',
        brand: '#bfa85d',
      },
    },
  },
  plugins: [typography],

}
