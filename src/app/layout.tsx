import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Larisin AI - CoPilot UMKM Lokal",
  description: "Asisten pemasaran AI untuk UMKM Indonesia. Edit foto produk, buat caption promosi, dan atur jadwal posting dengan mudah!",
  keywords: "UMKM, AI, pemasaran, foto produk, caption, promosi, Indonesia",
  authors: [{ name: "Larisin AI" }],
  other: {
    "dicoding:email": [
      "diyangraditya144@gmail.com",
      "najwamuthiaaziz@student.ub.ac.id",
      "nisma.aro@gmail.com",
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#5B6DFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-neutral-200/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
