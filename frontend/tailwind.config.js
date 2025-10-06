/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'kings': ['Kings', 'serif'],
        'quintessential': ['Quintessential', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
