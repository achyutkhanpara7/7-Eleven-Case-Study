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
        'primary-light': '#00A87F',
        'primary-dim': '#005A45',
        alert: '#ED2525',
        'alert-dim': '#B01C1C',
        accent: '#F4811F',
        'accent-dim': '#B85D10',
        base: '#07100D',
        'base-1': '#0D1A15',
        'base-2': '#122018',
        'base-3': '#1A2E22',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-green': '0 0 40px rgba(0,128,98,0.25)',
        'glow-red': '0 0 40px rgba(237,37,37,0.2)',
        'glow-orange': '0 0 40px rgba(244,129,31,0.2)',
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
