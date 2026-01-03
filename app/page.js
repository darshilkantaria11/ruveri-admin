'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  // ✅ Ensure client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!mounted) return;

    const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME?.trim();
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim();


    // 🔴 Safety check (important for localhost)
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      setError('Environment variables not loaded');
      return;
    }

    if (userId === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = btoa(`${userId}:${password}`);

      localStorage.setItem('admin_token', token);

      // ✅ use replace to avoid back navigation loop
      router.replace('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

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
              className="w-full px-3 py-2 rounded"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-red-400 mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-b1 text-white py-2 rounded hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
