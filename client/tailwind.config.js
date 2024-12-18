/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'load-progress': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        'flash': {
          '0%': { opacity: '0.3' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'load-progress': 'load-progress 3s ease-in-out infinite',
        'flash': 'flash 0.3s ease-out forwards'
      }
    },
  },
  plugins: [],
}