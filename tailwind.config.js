/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Preflight resets <button> backgrounds and breaks AntD; see index.css.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#016A70',
          50: '#E6F2F2',
          100: '#CCE5E6',
          200: '#99CBCD',
          500: '#016A70',
          600: '#01585D',
          700: '#014449',
          900: '#012A2D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.03)',
        lift: '0 12px 32px -12px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
}
