/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#f8fafc', // Page body background (very light slate)
          900: '#ffffff', // Cards, Table main bg (pure white)
          850: '#f1f5f9', // Table rows dividers, secondary cards (very light gray)
          800: '#e2e8f0', // Borders (soft gray)
          750: '#cbd5e1', 
          700: '#94a3b8', // Muted/disabled labels (medium-light gray)
          650: '#64748b',
          600: '#64748b', // Subtexts, small headers (medium gray)
          550: '#475569',
          500: '#475569', // Secondary body text (darker gray)
          450: '#334155',
          400: '#334155', // Regular readable text
          350: '#1e293b',
          300: '#1e293b', // Bold body text / emphasis
          250: '#0f172a',
          200: '#0f172a', // Section headers (almost black)
          150: '#0f172a',
          100: '#020617', // Main titles / page headers (pure black)
          50: '#0f172a',
        },
        violet: {
          950: '#f8fafc',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          650: '#0f172a', // Primary action buttons (slate-900)
          600: '#1e293b', // Hover states (slate-800)
          500: '#475569', // Active indicators
          400: '#0f172a', // Active link text
          300: '#1e293b', // Active badge text
          200: '#e2e8f0', // Active badge backgrounds (slate-200)
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        indigo: {
          950: '#f8fafc',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          660: '#0f172a',
          600: '#0f172a', // Primary brand buttons / links
          500: '#334155', // Hover
          400: '#0f172a', // Brand text (RatePulse)
          300: '#1e293b',
          200: '#e2e8f0', // badge backgrounds
          100: '#f1f5f9',
        }
      }
    },
  },
  plugins: [],
}
