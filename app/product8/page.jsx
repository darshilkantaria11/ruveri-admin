"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 🔥 Fetch Products
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
        const filterProducts = data.filter(
          (product) => product.category?.toLowerCase() === "rings"
        );

        setProducts(filterProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide">
            💍 Rings Collection
          </h1>

          <button
            onClick={() => router.push("/product8/add")}
            className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 hover:scale-105 transition transform"
          >
            + Add Rings
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-14 h-14 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 font-semibold text-lg">
            {error}
          </div>
        )}

        {/* Products */}
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
                const metalPrice = Number(product.metalPrice) || 0;
                const makingCharges = Number(product.makingCharges) || 0;
                const total = netWeight * metalPrice + makingCharges;

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
                            className="w-full object-cover rounded-md mb-4"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-md">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}

                        {/* Product Name */}
                        <h2 className="text-lg font-bold text-gray-800 truncate">
                          {product.productName}
                        </h2>

                        <p className="text-gray-600 text-sm mt-1 capitalize">
                          {product.category}
                        </p>

                        {/* Metal Details */}
                        <div className="mt-2 text-sm space-y-1">
                          <p className="text-gray-700">
                            <span className="font-semibold">Metal:</span>{" "}
                            {product.metal}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Gross:</span>{" "}
                            {product.grossWeight} g
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Net:</span>{" "}
                            {product.netWeight} g
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Making:</span> ₹
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
                            className={`${
                              product.status === "live"
                                ? "text-green-600"
                                : "text-red-700"
                            }`}
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
