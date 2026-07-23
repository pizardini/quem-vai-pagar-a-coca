"use client";

import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,

      primary: {
        main: "#C62828",
      },

      secondary: {
        main: "#1565C0",
      },

      background: {
        default: mode === "light" ? "#f5f5f5" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1E1E1E",
      },

      text: {
        primary: mode === "light" ? "#212121" : "#ffffff",
        secondary: mode === "light" ? "#616161" : "#BDBDBD",
      },
    },

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "none",
          },
        },
      },
    },
  });
}