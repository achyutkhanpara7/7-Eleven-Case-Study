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
        glass: 'rgba(255,255,255,0.04)',
        'glass-hover': 'rgba(255,255,255,0.07)',
        'glass-border': 'rgba(255,255,255,0.08)',
        'glass-border-hover': 'rgba(0,128,98,0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(0,128,98,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-hover': '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,128,98,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow-green': '0 0 40px rgba(0,128,98,0.25)',
        'glow-red': '0 0 40px rgba(237,37,37,0.2)',
        'glow-orange': '0 0 40px rgba(244,129,31,0.2)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
