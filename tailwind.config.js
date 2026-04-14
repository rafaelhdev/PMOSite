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
          50:  '#e8f0f9',
          100: '#c5d9f0',
          200: '#9ec0e6',
          300: '#77a7dc',
          400: '#5a93d5',
          500: '#2E75B6',
          600: '#1F4E79',
          700: '#193f61',
          800: '#133049',
          900: '#0d2132',
        },
      },
    },
  },
  plugins: [],
}
