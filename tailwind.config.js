const {nextui} = require('@nextui-org/theme');
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "// Ajuste os caminhos conforme necessário",
    "./node_modules/@nextui-org/theme/dist/components/[object Object].js"
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};
