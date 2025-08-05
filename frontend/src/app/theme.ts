import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#bbbbbb",
      light: "#e0e0e0",
      dark: "#999999",
      contrastText: "#000000",
    },
    secondary: {
      main: "#007bff",
      light: "#0056b3",
      dark: "#004085",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#171717",
      secondary: "#666666",
      disabled: "#999999",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    error: {
      main: "#dc3545",
      light: "#f8d7da",
      dark: "#721c24",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffc107",
      light: "#fff3cd",
      dark: "#856404",
      contrastText: "#000000",
    },
    success: {
      main: "#28a745",
      light: "#d4edda",
      dark: "#155724",
      contrastText: "#ffffff",
    },
    info: {
      main: "#17a2b8",
      light: "#d1ecf1",
      dark: "#0c5460",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          // Primary colors
          "--primary-color": "#bbbbbb",
          "--primary-light": "#e0e0e0",
          "--primary-dark": "#999999",

          // Secondary colors
          "--secondary-color": "#007bff",
          "--secondary-light": "#0056b3",
          "--secondary-dark": "#004085",

          // Background colors
          "--background": "#ffffff",
          "--foreground": "#171717",

          // Text colors
          "--text-primary": "#171717",
          "--text-secondary": "#666666",
          "--text-disabled": "#999999",

          // Grey scale
          "--grey-50": "#fafafa",
          "--grey-100": "#f5f5f5",
          "--grey-200": "#eeeeee",
          "--grey-300": "#e0e0e0",
          "--grey-400": "#bdbdbd",
          "--grey-500": "#9e9e9e",
          "--grey-600": "#757575",
          "--grey-700": "#616161",
          "--grey-800": "#424242",
          "--grey-900": "#212121",

          // Error colors
          "--error-color": "#dc3545",
          "--error-light": "#f8d7da",
          "--error-dark": "#721c24",
          "--error-main": "#dc3545",

          // Warning colors
          "--warning-color": "#ffc107",
          "--warning-light": "#fff3cd",
          "--warning-dark": "#856404",

          // Success colors
          "--success-color": "#28a745",
          "--success-light": "#d4edda",
          "--success-dark": "#155724",

          // Info colors
          "--info-color": "#17a2b8",
          "--info-light": "#d1ecf1",
          "--info-dark": "#0c5460",

          // Custom colors
          "--icon-color": "#6a5acd",
          "--header-bg": "#d9dea6",
          "--checkbox-blue": "#007bff",
        },
      },
    },
  },
});
