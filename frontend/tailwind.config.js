/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#15121F',
          soft: '#4B4560',
        },
        surface: {
          DEFAULT: '#FBFAFF',
          raised: '#FFFFFF',
          tint: '#F1EEFC',
        },
        brand: {
          50: '#F1EEFC',
          100: '#E4DEFA',
          200: '#C6B9F3',
          300: '#A28CEA',
          400: '#7C5FE0',
          500: '#5D3FD6',
          600: '#4A2FC0',
          700: '#3B25A0',
          800: '#2E1D7D',
          900: '#221660',
        },
        coral: {
          400: '#FF8F66',
          500: '#FF7A45',
          600: '#F0632C',
        },
        line: '#E5E1F5',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 20px 45px -20px rgba(34, 22, 96, 0.25)',
        soft: '0 8px 24px -8px rgba(34, 22, 96, 0.18)',
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at 1px 1px, rgba(93,63,214,0.14) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}
