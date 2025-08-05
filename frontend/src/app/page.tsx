"use client";

import { Box, Button, styled, Typography } from "@mui/material";
import Link from "next/link";

const StyledButton = styled(Button, {
  shouldForwardProp: prop => prop !== "buttonVariant",
})<{
  buttonVariant?: "primary" | "secondary";
}>(({ buttonVariant }) => ({
  display: "inline-block",
  textDecoration: "none",
  fontWeight: 600,
  padding: "0.75rem 2rem",
  borderRadius: "0.5rem",
  transition: "background-color 0.2s ease",
  textAlign: "center",
  textTransform: "none",
  ...(buttonVariant === "primary" && {
    backgroundColor: "#16a34a",
    color: "white",
    "&:hover": {
      backgroundColor: "#15803d",
    },
  }),
  ...(buttonVariant === "secondary" && {
    backgroundColor: "#4b5563",
    color: "white",
    "&:hover": {
      backgroundColor: "#374151",
    },
  }),
}));

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f0fdf4, #eff6ff)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: { xs: "2rem 1rem", md: "4rem 1rem" },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "64rem",
            margin: "0 auto",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "1.5rem",
            }}
          >
            Welcome to alma
            {/* <Box component="span" sx={{ color: "#16a34a" }}>
              alma
            </Box> */}
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              color: "#4b5563",
              marginBottom: "2rem",
              fontWeight: "normal",
            }}
          >
            Get an assessment of your immigration case from experienced
            attorneys
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <Link href="/lead-form" style={{ textDecoration: "none" }}>
              <StyledButton buttonVariant="primary">Get Started</StyledButton>
            </Link>
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <StyledButton buttonVariant="secondary">Admin Panel</StyledButton>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
