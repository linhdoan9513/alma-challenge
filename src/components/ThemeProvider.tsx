'use client'

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#333333',
    },
    secondary: {
      main: '#666666',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    error: {
      main: '#333333',
      light: '#333333',
      dark: '#333333',
      contrastText: '#ffffff',
    },
  },
  components: {
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiOutlinedInput-root': {
    //         '& fieldset': {
    //           borderColor: '#dee2e6',
    //         },
    //         '&:hover fieldset': {
    //           borderColor: '#333333',
    //         },
    //         '&.Mui-focused fieldset': {
    //           borderColor: '#333333',
    //         },
    //         '&.Mui-error fieldset': {
    //           borderColor: '#333333 !important',
    //         },
    //       },
    //     },
    //   },
    // },
    // MuiFormLabel: {
    //   styleOverrides: {
    //     root: {
    //       color: '#333333',
    //       '&.Mui-focused': {
    //         color: '#333333',
    //       },
    //       '&.Mui-error': {
    //         color: '#333333 !important',
    //       },
    //       '&.Mui-required::after': {
    //         color: '#333333 !important',
    //       },
    //     },
    //   },
    // },

    // MuiCheckbox: {
    //   styleOverrides: {
    //     // root: {
    //     //   color: '#dee2e6',
    //     //   '&.Mui-checked': {
    //     //     color: '#333333',
    //     //   },
    //     //   '&.Mui-error': {
    //     //     color: '#333333 !important',
    //     //   },
    //     // },
    //   },
    // },
    // MuiRadio: {
    //   styleOverrides: {
    //     root: {
    //       color: '#dee2e6',
    //       '&.Mui-checked': {
    //         color: '#333333',
    //       },
    //       '&.Mui-error': {
    //         color: '#333333 !important',
    //       },
    //     },
    //   },
    // },
    // MuiSelect: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiOutlinedInput-notchedOutline': {
    //         borderColor: '#dee2e6',
    //       },
    //       '&:hover .MuiOutlinedInput-notchedOutline': {
    //         borderColor: '#333333',
    //       },
    //       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //         borderColor: '#333333',
    //       },
    //       '&.Mui-error .MuiOutlinedInput-notchedOutline': {
    //         borderColor: '#333333 !important',
    //       },
    //     },
    //   },
    // },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#333333 !important',
          },
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
} 