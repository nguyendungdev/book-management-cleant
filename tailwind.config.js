import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // bg
        'light-bg': '#f2f7f5',
        'dark-bg': '#16161a',
        // text
        'dark-headline': '#fffffe',
        'light-headline': '#2b2c34',
        'dark-para': '#94a1b2',
        'light-para': '#2b2c34',
        // button
        'color-button': '#7f5af0',
        'color-button-text': '#fffffe',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#fff',
          },
        },
        dark: {
          colors: {
            background: '#16161a',
          },
        },
      },
    }),
  ],
};
