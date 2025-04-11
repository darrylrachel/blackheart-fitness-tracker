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
        background: '#f8f9fa',
        surface: '#ffffff',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        accent: '#282829', // #6366f1
        success: '#10b981',
        border: '#e5e7eb',
        error: '#e74c3c',
      },
    },
  },
  plugins: [typography],

}
