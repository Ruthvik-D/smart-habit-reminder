import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        navy: {
          50: '#f5f7fb',
          100: '#e9edf5',
          200: '#d3dbe9',
          300: '#aab7cf',
          400: '#7b8bab',
          500: '#56658a',
          600: '#3f4f72',
          700: '#2f3e5e',
          800: '#1f2d4a',
          900: '#14213d',
        },
        canvas: '#f6f7fb',
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20, 33, 61, 0.04), 0 8px 24px -12px rgba(20, 33, 61, 0.14)',
        lift: '0 2px 4px rgba(20, 33, 61, 0.06), 0 16px 32px -16px rgba(20, 33, 61, 0.22)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out both',
        'slide-up': 'slideUp 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
