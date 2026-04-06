/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        glitch: 'glitch 0.4s cubic-bezier(.25, .46, .45, .94) both infinite',
      },
      keyframes: {
        glitch: {
          '0%': {
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)',
            textShadow: 'none',
            clipPath: 'inset(0 0 0 0)'
          },
          '20%': {
            transform: 'translate(-2px, 2px)',
            filter: 'hue-rotate(90deg)',
            textShadow: '2px 0 #ff0000, -2px 0 #00ff00',
            clipPath: 'inset(10% 0 80% 0)'
          },
          '40%': {
            transform: 'translate(-2px, -2px)',
            filter: 'hue-rotate(180deg)',
            textShadow: '-2px 0 #ff0000, 2px 0 #00ff00',
            clipPath: 'inset(40% 0 10% 0)'
          },
          '60%': {
            transform: 'translate(2px, 2px)',
            filter: 'hue-rotate(270deg)',
            textShadow: '2px 0 #0000ff, -2px 0 #ff0000',
            clipPath: 'inset(80% 0 5% 0)'
          },
          '80%': {
            transform: 'translate(2px, -2px)',
            filter: 'hue-rotate(360deg)',
            textShadow: '-2px 0 #00ff00, 2px 0 #0000ff',
            clipPath: 'inset(20% 0 40% 0)'
          },
          '100%': {
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)',
            textShadow: 'none',
            clipPath: 'inset(0 0 0 0)'
          }
        }
      }
    },
  },
  plugins: [],
}