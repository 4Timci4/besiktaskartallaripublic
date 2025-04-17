/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'besiktas': {
          red: '#FF3B4A',
        },
        'gray': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Matroska', 'system-ui', 'sans-serif'],
        heading: ['BlackCloudsWhiteSky', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Ana başlıklar
        'h1': ['2rem', { // 32px
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          fontWeight: '700',
        }],
        // Alt başlıklar
        'h2': ['1.5rem', { // 24px
          lineHeight: '1.3',
          letterSpacing: '-0.01em',
          fontWeight: '600',
        }],
        // Normal metin
        'base': ['1rem', { // 16px
          lineHeight: '1.5',
          letterSpacing: '0',
        }],
        // Küçük metinler
        'sm': ['0.875rem', { // 14px
          lineHeight: '1.4',
          letterSpacing: '0',
        }],
        // Dipnotlar
        'xs': ['0.75rem', { // 12px
          lineHeight: '1.3',
          letterSpacing: '0',
        }],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
