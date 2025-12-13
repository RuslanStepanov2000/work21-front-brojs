/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
        },
      },
    },
  },
  plugins: [],
}

