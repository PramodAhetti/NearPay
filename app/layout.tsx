import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./component/sessionWrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NearPay",
  description: "Saved QR codes for quick payments",
  icons: ['./bg.png'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="text-black">
      <SessionWrapper>
      <body className={inter.className}>{children}</body>
      </SessionWrapper>
    </html>
  );
}
      
