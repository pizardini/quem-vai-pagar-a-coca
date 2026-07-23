"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0",
    },
    secondary: {
      main: "#c62828",
    },
    background: {
      default: "#f6f7f9",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
