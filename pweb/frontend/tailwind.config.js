module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // This includes all HTML, JS, JSX, TS, and TSX files in the src folder
    './src/**/pages/*.js', // This adds the specific pattern for JS files inside any `pages` folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
