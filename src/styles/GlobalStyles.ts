'use client'

import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  /* ---------- CSS Reset + Box Model ---------- */
  *, *::before, *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    max-width: 100vw;
    overflow-x: hidden;
    color-scheme: light;
  }

  body {
    --font-sans: var(--font-geist-sans);
    --font-mono: var(--font-geist-mono);
  }

  body {
    font-family: var(--font-sans), var(--font-mono), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: rgb(var(--foreground-rgb));
    background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    ) rgb(var(--background-start-rgb));
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
  }

  /* ---------- Validation + Label Styling ---------- */
  .MuiFormHelperText-root {
    display: none !important;
  }

  /* ---------- Form Layout + Input Field Sizing ---------- */
  .MuiGrid-container {
    justify-content: center !important;
  }

  .MuiGrid-item {
    display: flex !important;
    justify-content: center !important;
  }

  .MuiFormControl-root {
    width: 100% !important;
    max-width: 500px !important;
    margin-bottom: 2rem !important;
  }

  .MuiTextField-root,
  .MuiFormControl-root,
  .MuiSelect-root {
    width: 100% !important;
    max-width: 500px !important;
  }

  /* ---------- Fix Checkbox / Radio Layout ---------- */
  .MuiFormGroup-root {
    flex-direction: column !important;
    align-items: flex-start !important;
    width: 100%;
  }

  .MuiFormControlLabel-root {
    margin: 0.25rem 0 !important;
    justify-content: flex-start !important;
    width: auto !important;
  }

  .MuiCheckbox-root,
  .MuiRadio-root {
    padding: 4px !important;
    margin: 0 !important;
  }

  label.MuiFormControlLabel-root {
    width: auto !important;
  }

  /* ---------- Submit Button Styling ---------- */
  button[type="submit"],
  .MuiButton-root[type="submit"] {
    width: 100% !important;
    max-width: 500px !important;
    margin: 0 auto !important;
    display: block !important;
  }

  /* ---------- Remove 'x' clear button in WebKit browsers ---------- */
  input::-webkit-search-cancel-button {
    display: none;
    -webkit-appearance: none;
  }

  input[type="search"] {
    -webkit-appearance: none;
  }

  .MuiInputAdornment-root {
    display: none !important;
  }
`

export default GlobalStyles
