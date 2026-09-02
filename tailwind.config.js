/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#fdfbf7',
          50: '#ffffff',
          100: '#fdfbf7',
          200: '#f4ede4',
          300: '#e8dbce',
          400: '#d9c5b2',
          500: '#c6a992',
          600: '#b8947b',
          700: '#9a7660',
          800: '#806454',
          900: '#675246',
        },
        charcoal: {
          DEFAULT: '#2c2925',
          light: '#423f3b',
          dark: '#1a1815'
        },
        terracotta: {
          DEFAULT: '#c25e4c',
          light: '#d47867',
          dark: '#9c4535'
        },
        sage: {
          DEFAULT: '#7a8b75',
          light: '#94a48f',
          dark: '#5d6d59'
        },
        gold: {
          DEFAULT: '#d4af37',
          muted: '#bda04a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
