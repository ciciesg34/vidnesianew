/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0C10',
        card: '#1F242D',
        accent: '#10B981',
        accentNeon: '#00FF66',
        muted: '#9CA3AF'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' }
        }
      }
    }
  },
  plugins: []
};