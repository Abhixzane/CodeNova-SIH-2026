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
        },
        saffron: {
          DEFAULT: '#e66a1f',
          light: '#f97316',
          dark: '#c2410c',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
        },
        navy: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          dark: '#020617',
          muted: '#334155',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
