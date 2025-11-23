"use client";

import { useEffect, useState } from "react";

export default function CurrencyPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 🔽 Load Currency Data
  async function load() {
  const res = await fetch("/api/currency", {
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY // PUBLIC KEY for Client
    }
  });

  const data = await res.json();

  const sorted = data.data.sort((a, b) => b.rateInINR - a.rateInINR);
  setList(sorted);
  setLoading(false);
}


  useEffect(() => {
    load();
  }, []);

  // 🔁 Fetch / Update Rates Now (Manual Button)
  async function updateRates() {
    try {
      setUpdating(true);
      const res = await fetch("/api/currency/fetch", {
        method: "POST",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      });

      const data = await res.json();
      if (data?.message) alert("Currency updated successfully!");
      else alert("Something went wrong!");
    } catch (err) {
      alert("API Error");
    } finally {
      setUpdating(false);
      load(); // Refresh table
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-b1">
          🌍 Currency Rates vs INR
        </h1>

        {/* 🔘 Fetch Button */}
        <button
          onClick={updateRates}
          disabled={updating}
          className={`px-5 py-2 rounded-md text-white shadow-md transition ${
            updating ? "bg-gray-400 cursor-not-allowed" : "bg-b1 hover:scale-105"
          }`}
        >
          {updating ? "Updating..." : "Fetch Currency"}
        </button>
      </div>

      {/* 🔄 Loading Table */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="w-12 h-12 border-4 border-t-b1 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto w-full overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg border">
            <thead className="bg-b1 text-white text-lg">
              <tr>
                <th className="py-3 px-4 text-left">Sr.</th>
                <th className="py-3 px-4 text-left">Currency</th>
                <th className="py-3 px-4 text-left">Code</th>
                <th className="py-3 px-4 text-left">Value (in ₹)</th>
              </tr>
            </thead>

            <tbody>
              {list.map((cur, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-100 transition"
                >
                  <td className="py-3 px-4 font-medium">{index + 1}</td>
                  <td className="py-3 px-4">{cur.name}</td>
                  <td className="py-3 px-4 font-semibold">{cur.code}</td>
                  <td className="py-3 px-4 font-bold text-g2">
                    ₹{cur.rateInINR.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
