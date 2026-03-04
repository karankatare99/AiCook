import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CursorRenderer from "@/components/CursorRenderer";
import PageLoader from "@/components/PageLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoiceBite",
  description: "Cook with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-accent/20 selection:text-accent`}
      >
        <PageLoader />
        <CursorRenderer />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
