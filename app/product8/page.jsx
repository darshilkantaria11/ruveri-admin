"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

/* ------------------ PURITY MULTIPLIERS ------------------ */
const getPurityMultiplier = (metal, purity) => {
  const goldMap = {
    "24K": 1,
    "22K": 0.916,
    "20K": 0.833,
    "18K": 0.75,
    "14K": 0.585,
  };

  const silverMap = {
    "999 Silver": 1,
    "950 Silver": 0.95,
    "925 Silver": 0.925,
    "900 Silver": 0.9,
    "800 Silver": 0.8,
  };

  if (metal === "gold") return goldMap[purity] || 1;
  if (metal === "silver") return silverMap[purity] || 1;

  return 1;
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  /* ------------------ FETCH PRODUCTS ------------------ */
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products", {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        });

        if (!response.ok) throw new Error("Error fetching products");

        const data = await response.json();

        const filtered = data.filter(
          (product) => product.category?.toLowerCase() === "rings"
        );

        setProducts(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-b3 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* ------------------ HEADER ------------------ */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide">
            💍 Rings Collection
          </h1>

          <button
            onClick={() => router.push("/product8/add")}
            className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 hover:scale-105 transition"
          >
            + Add Rings
          </button>
        </div>

        {/* ------------------ LOADING ------------------ */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-14 h-14 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin" />
          </div>
        )}

        {/* ------------------ ERROR ------------------ */}
        {error && (
          <div className="text-center text-red-600 font-semibold text-lg">
            {error}
          </div>
        )}

        {/* ------------------ PRODUCTS ------------------ */}
        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {products.length > 0 ? (
              products.map((product) => {
                const netWeight = Number(product.netWeight) || 0;
                const metalPrice = Number(product.metalPrice) || 0; // PURE price
                const makingCharges = Number(product.makingCharges) || 0;

                /* -------- PRICE CALCULATION (CORE LOGIC) -------- */
                const purityMultiplier = getPurityMultiplier(
                  product.metal,
                  product.purity
                );

                const effectiveMetalPrice =
                  metalPrice * purityMultiplier;

                const rawTotal =
                  netWeight * effectiveMetalPrice + makingCharges;

                // 🔒 ALWAYS ROUND UP
                const total = Math.ceil(rawTotal);

                return (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Link href={`/product8/${product._id}`}>
                      <div
                        className={`${
                          product.status === "live"
                            ? "bg-white border-green-200"
                            : "bg-red-50 border-red-200"
                        } border p-4 rounded-xl shadow-sm hover:shadow-xl cursor-pointer transition`}
                      >
                        {/* Image */}
                        {product.img1 ? (
                          <img
                            src={product.img1}
                            alt={product.productName}
                            className="w-full h-48 object-cover rounded-md mb-4"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded-md mb-4">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}

                        {/* Name */}
                        <h2 className="text-lg font-bold text-gray-800 truncate">
                          {product.productName}
                        </h2>

                        <p className="text-gray-600 text-sm mt-1 capitalize">
                          {product.category}
                        </p>

                        {/* Details */}
                        <div className="mt-2 text-sm space-y-1">
                          <p><b>Metal:</b> {product.metal}</p>
                          <p><b>Purity:</b> {product.purity}</p>
                          <p><b>Gross:</b> {product.grossWeight} g</p>
                          <p><b>Net:</b> {product.netWeight} g</p>
                          <p>
                            <b>Making:</b> ₹
                            {makingCharges.toLocaleString()}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="mt-3">
                          <p className="text-gray-500 text-xs">Total Price</p>
                          <p className="text-xl font-extrabold text-green-600">
                            ₹{total.toLocaleString()}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="mt-3 text-sm font-bold">
                          <span
                            className={
                              product.status === "live"
                                ? "text-green-600"
                                : "text-red-700"
                            }
                          >
                            {product.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                          <span>View Details</span>
                          <span className="text-green-600 font-bold text-lg">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 col-span-full">
                No products found.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
