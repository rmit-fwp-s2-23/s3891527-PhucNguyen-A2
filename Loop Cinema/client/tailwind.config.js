/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat", 'sans-serif'],
    },
    extend: {},
    colors: {
      'white': '#fff',
      'black': '#000',
      'grey': '#aaa',
      'blue': '#4285F4',
      'gold': '#ffd900',
      'red': '#FF0000',
      'green': '#008000'
    },
  },
  plugins: [],
}

