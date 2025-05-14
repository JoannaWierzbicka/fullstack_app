// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A4B465', 
    },
    secondary: {
      main: '#626F47', // purple
    },
    background: {
      default: '#F5ECD5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#F5ECD5',
            margin: 0,
            padding: 0,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
          a: {
            textDecoration: 'none',
            color: 'inherit',
          },
          '*': {
            boxSizing: 'border-box',
          },
        },
      },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
