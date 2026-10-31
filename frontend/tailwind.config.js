/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // AlgoArena Signature Palette
        navy: {
          950: '#070A14',
          900: '#0B1020', // Midnight Navy background
          850: '#0E1428',
          800: '#12182F', // Cards
          750: '#161F3C',
          700: '#1E294B', // Borders
          600: '#2A3865',
        },
        violet: {
          500: '#8B5CF6',
          600: '#7C3AED', // Electric Violet
          700: '#6D28D9',
        },
        mint: {
          400: '#34D399', // Mint Green
          500: '#10B981',
          600: '#059669',
        },
        gold: {
          400: '#FBBF24', // XP Gold / Amber
          500: '#F59E0B',
          600: '#D97706',
        },
        darkBg: '#0B1020',
        cardBg: '#12182F',
        cardBorder: '#1E294B',
        verdict: {
          ac: '#34D399',   // Mint Green (Accepted)
          wa: '#EF4444',   // Red (Wrong Answer)
          tle: '#FBBF24',  // XP Amber (Time Limit Exceeded)
          re: '#F97316',   // Orange (Runtime Error)
          ce: '#7C3AED',   // Electric Violet (Compilation Error)
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Sora', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #34D399 100%)',
        'arena-gradient': 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
        'glow-gradient': 'radial-gradient(ellipse at top, rgba(124, 58, 237, 0.25), transparent 70%)',
      },
    },
  },
  plugins: [],
}
