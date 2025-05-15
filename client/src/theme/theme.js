// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6D9886', // soft green
    },
    secondary: {
      main: '#393E46', // dark grey
    },
    background: {
      default: '#F2E7D5', // light beige
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F2E7D5',
          margin: 0,
          padding: 0,
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
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
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          width: '100%',
          minHeight: '180px',
          padding: '16px',
          borderRadius: 16,
          backgroundColor: '#fff',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '18px',
          borderRadius: 16,
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
  },
});

export default theme;
