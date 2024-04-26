/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {},

  plugins: [require("tailwindcss-animated")],
};

module.exports = config;
