"use client";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        mb: 4,
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
      >
        Quem vai pagar a Coca?
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        {children}
      </Paper>
    </Container>
  );
}
