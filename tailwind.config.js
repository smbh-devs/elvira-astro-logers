/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FBF8F3',
          100: '#F5EFE6',
          200: '#EDE4D6',
          300: '#E0D2BE',
          400: '#CDB99E',
          500: '#B8A07E',
        },
        bordeaux: {
          50: '#FBF2F4',
          100: '#F5E0E4',
          200: '#E8C2CA',
          300: '#D49BAA',
          400: '#B5687E',
          500: '#8E3F56',
          600: '#6B2737',
          700: '#5A1F2E',
          800: '#4A1925',
          900: '#3D141F',
        },
        gold: {
          400: '#D4B26A',
          500: '#B8964F',
          600: '#9C7E3E',
        },
        charcoal: {
          800: '#2D2A26',
          900: '#1F1D1A',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
