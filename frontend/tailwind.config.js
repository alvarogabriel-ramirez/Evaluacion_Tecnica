/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3bc4f6',
          600: '#25aceb',
          700: '#1d8ad8',
          800: '#1e6baf',
          900: '#1e718a',
        },
      },
    },
  },
  plugins: [],
}
