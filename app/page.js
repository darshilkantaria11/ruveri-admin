'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (userId === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // simple deterministic token
      const token = btoa(`${userId}:${password}`);

      localStorage.setItem('admin_token', token);
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

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
              required
            />
          </div>

          {error && <p className="text-red-400 mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-b1 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
