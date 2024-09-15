/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Include all JS, TS, JSX, TSX files inside src/
  ],
  theme: {
    extend: {
      colors: {
        'verseform-purple': '#9333ea', // Approximation of purple-600
        'verseform-blue': '#3b82f6',   // Approximation of blue-500
      },
    },
  },
  plugins: [],
  corePlugins: {
    // This will generate utilities for controlling overflow behavior
    overflow: true,
  },
};