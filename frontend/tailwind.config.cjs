/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '550px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        montserrat: 'Montserrat, sans-serif',
      },
      gridTemplateRows: {
        '7-max-content': 'repeat(7, max-content)',
      },
      borderWidth: {
        3: '3px',
      },
      colors: {
        'bg-main': '#F3F7F9',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
    },
  },
};
