/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#0A0B0F',
        'cosmic-purple': '#2A1B3D',
        'electric-blue': '#4B7BF5',
        'vibrant-purple': '#8A2BE2',
        'gold': '#FFD700',
        'neon-green': '#50FA7B',
        'cyber-red': '#FF5555',
      },
      fontFamily: {
        'game-title': ['Russo One', 'sans-serif'],
        'game-body': ['Chakra Petch', 'sans-serif'],
        'game-mono': ['Share Tech Mono', 'monospace'],
      },
      keyframes: {
        'load-progress': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        'flash': {
          '0%': { opacity: '0.3' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '0' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' }
        },
        'progress-shine': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'load-progress': 'load-progress 3s ease-in-out infinite',
        'flash': 'flash 0.3s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s infinite',
        'progress-shine': 'progress-shine 2s infinite'
      }
    },
  },
  plugins: [],
}