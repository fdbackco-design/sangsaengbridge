import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#f5e8ea',
          100: '#e8d1d5',
          200: '#d9b5bb',
          300: '#c8969f',
          400: '#b87783',
          500: '#a85a6a',
          600: '#8b3d4d',
          700: '#6B1D2A',
          800: '#5a1824',
          900: '#4a141e',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfaf5',
          200: '#faf5eb',
          300: '#f7f0e1',
        },
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px rgba(107, 29, 42, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
