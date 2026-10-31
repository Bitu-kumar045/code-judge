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
        darkBg: '#0B0F19',
        cardBg: '#111827',
        cardBorder: '#1F2937',
        verdict: {
          ac: '#10B981',   // Accepted (Green)
          wa: '#EF4444',   // Wrong Answer (Red)
          tle: '#F59E0B',  // Time Limit Exceeded (Yellow)
          re: '#F97316',   // Runtime Error (Orange)
          ce: '#8B5CF6',   // Compilation Error (Purple)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)',
        'glow-gradient': 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 70%)',
      },
    },
  },
  plugins: [],
}
