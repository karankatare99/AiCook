import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, DM_Sans, DM_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CursorRenderer from "@/components/CursorRenderer";
import PageLoader from "@/components/PageLoader";
import Sidebar from "@/components/Sidebar";
import FluidBackground from "@/components/FluidBackground";
import { ToastProvider } from "@/components/ToastSystem";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const dmMono = DM_Mono({ variable: "--font-dm-mono", weight: ["400", "500"], subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", weight: ["400", "500", "600", "700"], style: ["normal", "italic"], subsets: ["latin"] });

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
        className={`${inter.variable} ${dmSans.variable} ${dmMono.variable} ${cormorant.variable} font-sans antialiased bg-[#0A0A0F] text-[#F5EDD6] selection:bg-[#E8602C]/20 selection:text-[#E8602C]`}
      >
        <ToastProvider>
          <PageLoader />
          <CursorRenderer />
          <FluidBackground />
          <Sidebar />
          <Suspense fallback={null}>
            <SmoothScroll>
              <div className="md:ml-20 min-h-screen pb-20 md:pb-0">
                {children}
              </div>
            </SmoothScroll>
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
