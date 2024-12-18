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
          '0%': { backgroundColor: '#FFD700' },
          '100%': { backgroundColor: 'transparent' }
        }
      },
      animation: {
        'load-progress': 'load-progress 3s ease-in-out infinite',
        'flash': 'flash 0.3s ease-out'
      }
    },
  },
  plugins: [],
}