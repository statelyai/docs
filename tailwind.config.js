/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          25: '#f5f7f7',
          50: '#eff1f3',
          100: '#dfe3e7',
          200: '#ced1da',
          300: '#bdc2cc',
          400: '#9da1b1',
          500: '#72758b',
          600: '#606478',
          700: '#4d4f5f',
          800: '#2e2f3c',
          850: '#1f1f29',
          900: '#15151d',
        },
        blue: {
          500: '#0f6ee5',
        },
        pink: {
          500: '#cf249b',
        },
        orange: {
          500: '#c14f0f',
        },
        green: {
          500: '#29833b',
        },
        purple: {
          500: '#8355e5',
        },
      },
    },
  },
  plugins: [],
};
