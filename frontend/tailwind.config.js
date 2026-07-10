/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Body / UI
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Display headings
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        // Code + labels
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Swiss Neutral system
        signal: {
          DEFAULT: '#E5241B',
          dark: '#C01810',
        },
      },
      letterSpacing: {
        label: '0.18em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
}
