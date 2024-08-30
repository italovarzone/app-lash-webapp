// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5', // Cor primária (bg-indigo-600)
      contrastText: '#ffffff', // Cor de contraste do texto
    },
    secondary: {
      main: '#f0f0f0', // Cor secundária (cinza claro)
      contrastText: '#000000', // Cor de contraste do texto
    },
  },
});

export default theme;
