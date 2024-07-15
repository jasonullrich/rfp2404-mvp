/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme.js'

export default {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Shadows Into Light Two"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
