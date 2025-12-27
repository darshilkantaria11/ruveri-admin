"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./nopage/navbar";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') return; // allow login page

    const token = localStorage.getItem('admin_token');
    const expectedToken = btoa(
      `${process.env.NEXT_PUBLIC_ADMIN_USERNAME}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`
    );

    if (token !== expectedToken) {
      router.replace('/');
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <Navbar />
        {children}
      </body>
    </html>
  );
}
