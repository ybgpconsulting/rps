/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          DEFAULT: '#142D59',
          deep: '#0A1B33',
          ink: '#081527',
          soft: '#1E3E70',
          mist: '#EFF5FC',
        },
        gold: {
          DEFAULT: '#D6AD55',
          light: '#EBD3A0',
          pale: '#F6ECD6',
          deep: '#A67C2E',
        },
        ink: '#202A3A',
        cream: '#F9F6F0',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', '"Noto Serif Devanagari"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        mega: '0.3em',
      },
      boxShadow: {
        soft: '0 24px 70px -32px rgba(10, 27, 51, 0.35)',
        lift: '0 30px 80px -36px rgba(10, 27, 51, 0.5)',
        gold: '0 18px 50px -18px rgba(214, 173, 85, 0.55)',
        insetGold: 'inset 0 0 0 1px rgba(214, 173, 85, 0.35)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 26s linear infinite',
        sheen: 'sheen 1.1s ease-out',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
