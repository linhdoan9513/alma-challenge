"use client";

import EmotionRegistry from "@/components/EmotionRegistry";
import { CssBaseline } from "@mui/material";
import "./globals.css"; // or any global styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EmotionRegistry>
          <CssBaseline />
          {children}
        </EmotionRegistry>
      </body>
    </html>
  );
}
