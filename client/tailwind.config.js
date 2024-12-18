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
        'button-flash': {
          '0%': { 
            backgroundColor: '#FFD700',
            borderColor: '#FFD700',
          },
          '100%': { 
            backgroundColor: '#1E1E22',
            borderColor: 'rgba(255, 215, 0, 0.1)'
          }
        }
      },
      animation: {
        'load-progress': 'load-progress 3s ease-in-out infinite',
        'button-flash': 'button-flash 0.2s ease-out forwards'
      }
    },
  },
  plugins: [],
}
