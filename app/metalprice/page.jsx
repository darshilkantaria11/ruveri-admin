"use client";

import { useEffect, useState } from "react";

export default function MetalPricesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 🔽 Load Metal Prices
  async function load() {
    const res = await fetch("/api/metals", {
    });

    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }

  // 🔁 Manual Fetch Button
  async function fetchPricesNow() {
    try {
      setUpdating(true);

      const res = await fetch("/api/metals/fetch", {
        method: "POST",
      });

      const data = await res.json();

      if (data?.message) {
        alert("Metal prices updated successfully!");
        await load(); // Refresh UI
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      alert("API Error");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-b1">
            🪙 Metal Prices (₹ / gram)
          </h1>

          <button
            onClick={fetchPricesNow}
            disabled={updating}
            className={`px-5 py-2 rounded-md text-white shadow-md transition ${
              updating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-b1 hover:scale-105"
            }`}
          >
            {updating ? "Updating..." : "Fetch Prices"}
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="w-12 h-12 border-4 border-t-b1 border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {data.map((item) => (
              <div
                key={item.metal}
                className="p-6 border rounded-xl shadow-md hover:scale-105 transition"
              >
                <h2 className="text-2xl font-bold mb-2">
                  {item.metal === "GOLD" ? "🥇 Gold" : "🥈 Silver"}
                </h2>

                <p className="text-3xl font-extrabold text-g2">
                  ₹{item.priceInINR.toFixed(2)}
                  <span className="text-base font-medium text-gray-600">
                    {" "} / gram
                  </span>
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Updated: {new Date(item.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
