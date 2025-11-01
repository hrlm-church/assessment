/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jidox color scheme
        primary: {
          DEFAULT: '#4254ba',
          50: '#f0f2fb',
          100: '#e6e9f8',
          200: '#cdd3f1',
          300: '#a5b0e6',
          400: '#7687d8',
          500: '#4254ba',
          600: '#3644a3',
          700: '#2d378a',
          800: '#242d71',
          900: '#1b235a',
        },
        success: '#51b355',
        danger: '#f7473a',
        warning: '#fec20d',
        info: '#299bf6',
        purple: '#815ac5',
        pink: '#ff679b',
        dark: '#49526b',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
