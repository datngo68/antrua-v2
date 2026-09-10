import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnTrua",
  description: "Quản lý ăn trưa theo nhóm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-[100dvh]`}>
        {children}
      </body>
    </html>
  );
}
