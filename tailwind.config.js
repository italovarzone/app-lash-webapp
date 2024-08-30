const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Inclui todos os arquivos na pasta src
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // Inclui todos os componentes do nextui
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Cor primária igual ao tema do MUI (bg-indigo-600)
        secondary: '#f0f0f0', // Cor secundária (cinza claro)
      },
    },
  },
  plugins: [nextui()],
};
