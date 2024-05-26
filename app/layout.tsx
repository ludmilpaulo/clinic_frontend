import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Men's Clinic - Comprehensive Men's Health Solutions",
  description: "Men's Clinic offers specialized products for men's health, including solutions for erectile dysfunction and mental health support. Enhance your well-being with our expert-approved treatments.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        </body>
    </html>
    </StoreProvider>
  );
}
