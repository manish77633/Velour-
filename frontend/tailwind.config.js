/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        cream:  '#FAF7F2',
        warm:   '#8B6F5C',
        accent: '#C4A882',
        soft:   '#EDE8DF',
        muted:  '#8A8178',
        dark:   '#1C1917',
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        fadeUp:  'fadeUp 0.4s ease forwards',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp:  { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
