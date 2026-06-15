/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#008062',
        'primary-light': '#00B882',
        'primary-dark': '#005A45',
        alert: '#ED2525',
        accent: '#F4811F',
        ink: '#111810',
        'ink-2': '#2C3E35',
        'ink-3': '#5A6E64',
        muted: '#8EA89E',
        's-white': '#ffffff',
        's-green': '#EBF5EF',
        's-pink': '#FDF0F0',
        's-yellow': '#FDF8EC',
        's-dark': '#0D1F18',
        's-teal': '#E8F4F0',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.1)',
        'hero-img': '0 24px 64px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
