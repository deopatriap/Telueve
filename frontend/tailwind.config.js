/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nier: {
          sand: '#DAD4BB',
          cream: '#F0EBE3',
          dark: '#3D3929',
          accent: '#454138',
          border: '#B8B4A0',
          muted: '#A8A28F',
          highlight: '#C4BDA4',
        }
      },
    },
  },
  plugins: [],
}
