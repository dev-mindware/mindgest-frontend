/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
        colors: {
          wb: '#5B21B6',
          secondary: '#A78BFA',
          accent: '#E9D5FF',
          dark: '#1E1B4B',
          light: '#F3F4F6',
        }
    },
  },
  plugins: [],
}
