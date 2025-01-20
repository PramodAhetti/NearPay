import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./component/sessionWrapper";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "sonner";




export const metadata: Metadata = {
  title: "NearPay",
  description: "Saved QR codes for quick payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="text-black">
      <head>
      <link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
      </head>
      <SessionWrapper>
        <Toaster position="top-right"/>
      <body className={inter.className}>{children}</body>
      </SessionWrapper>
    </html>
  );
}
      
