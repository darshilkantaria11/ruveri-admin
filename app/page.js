"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  // Ensure client-side
  useEffect(() => {
    setMounted(true);

    // If already logged in → redirect
    const token = localStorage.getItem("admin_token");
    const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME?.trim();
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim();
    const expectedToken = btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);

    if (token === expectedToken) {
      console.log("Already logged in, redirecting to dashboard");
      router.replace("/admindashboard");
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!mounted) return;

    setLoading(true);
    setError("");

    const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME?.trim();
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim();
    const expectedToken = btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);

    console.log("Login attempt:", { userId, password, ADMIN_USERNAME, ADMIN_PASSWORD });

    if (userId.trim() === ADMIN_USERNAME && password.trim() === ADMIN_PASSWORD) {
      localStorage.setItem("admin_token", expectedToken);
      console.log("Login success, token saved:", expectedToken);

      router.replace("/dashboard"); // proper Next.js redirect
    } else {
      console.log("Login failed");
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  if (!mounted) return null; // prevent hydration mismatch

  return (
    <div className="min-h-screen flex items-center justify-center bg-b3">
      <div className="w-full max-w-sm p-6 bg-b2 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Ruveri Jewel – Admin
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">User ID</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white"
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-400 mb-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-b1 text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
