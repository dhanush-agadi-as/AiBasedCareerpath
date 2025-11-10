/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ important line
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // your src folder files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
