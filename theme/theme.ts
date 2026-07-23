"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        mode: "light",

        primary: {

            main: "#1976d2"

        },

        secondary: {

            main: "#ef6c00"

        }

    },

    shape: {

        borderRadius: 10

    }

});

export default theme;