"use client";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function Layout({

    children,

}: {

    children: React.ReactNode;

}) {

    return (

        <Container
            maxWidth="lg"
            sx={{
                mt:4,
                mb:4
            }}
        >

            <Typography
                variant="h3"
                align="center"
                gutterBottom
            >

                🥤 Quem vai pagar a Coca?

            </Typography>

            <Paper
                sx={{
                    p:4
                }}
            >

                {children}

            </Paper>

        </Container>

    );

}