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
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = () => {
      setLoading(true);

      const publicPaths = ["/", "/login"];
      const currentPath = pathname?.split("?")[0] || "/";

      // Public page → allow
      if (publicPaths.includes(currentPath)) {
        console.log("Public path:", currentPath);
        setAuthorized(true);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("admin_token");
      const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME?.trim();
      const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim();
      const expectedToken = btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);

      console.log("Auth check:", { token, expectedToken, match: token === expectedToken });

      if (token === expectedToken) {
        setAuthorized(true);
      } else {
        console.log("Invalid token, redirecting to login");
        localStorage.removeItem("admin_token");
        router.replace("/"); // safe Next.js redirect
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, mounted, router]);

  if (!mounted || loading) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="min-h-screen flex items-center justify-center bg-b3">
            <div className="text-white">Loading...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <Navbar />
        {authorized && children}
      </body>
    </html>
  );
}
