"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./nopage/navbar";
import { useEffect, useState } from "react";
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
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // allow login page
    if (pathname === "/") {
      setChecked(true);
      return;
    }

    const token = localStorage.getItem("admin_token");

    const USER = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    // 🔴 ENV SAFETY CHECK (important)
    if (!USER || !PASS) {
      console.error("❌ Admin env vars missing");
      router.replace("/");
      return;
    }

    const expectedToken = btoa(`${USER}:${PASS}`);

    if (token !== expectedToken) {
      router.replace("/");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  // ⏳ Prevent hydration redirect loop
  if (!checked && pathname !== "/") return null;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
