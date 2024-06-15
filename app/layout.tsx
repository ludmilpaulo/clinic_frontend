import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Men's Clinic - Expert Men's Health Solutions",
  description:
    "Discover specialized treatments for men's health at Men's Clinic. From erectile dysfunction to mental health support, our expert-approved products are designed to enhance your well-being. Join thousands of satisfied customers and take the first step towards a healthier you today.",
  openGraph: {
    images: [
      {
        url: "https://ludmil.pythonanywhere.com/media/logo/logo2_w3URzZg.png",
        alt: "Men's Clinic Logo",
      },
    ],
  },
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
