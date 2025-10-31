import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import router from './router/router.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { LocaleProvider } from './context/LocaleContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocaleProvider>
        <AuthProvider>        
          <RouterProvider router={router} />
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  </React.StrictMode>
);
