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

  // ✅ Fetch all products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products", {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Unable to fetch products`);
        }

        const data = await response.json();
          
        const filterProducts = data.filter(
          (product) => product.category?.toLowerCase() === "earrings"
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
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-b1 tracking-wide">
            Earrings
          </h1>
          <button
            onClick={() => router.push("/product4/add")}
            className="bg-b1 text-white px-6 py-3 rounded-lg shadow-lg  transition-all transform hover:scale-105"
          >
            + Add Earrings
          </button>
        </div>

        {/* ✅ Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-t-b1 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}

        {/* ✅ Error State */}
        {error && (
          <div className="text-center text-red-500 font-semibold text-lg">
            {error}
          </div>
        )}

        {/* ✅ Products Grid */}
        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {products.length > 0 ? (
              products.map((product) => {
                const bgColor =
                  product.status === "live" ? "bg-b3" : "bg-red-200";

                return (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href={`/product4/${product._id}`}>
                      <div
                        className={`${bgColor} p-5 rounded-xl shadow-md hover:shadow-2xl transition-all cursor-pointer`}
                      >
                        {/* Product Image */}
                        {product.img1 ? (
                          <img
                            src={product.img1}
                            alt={product.productName}
                            className="w-full h-40 object-cover rounded-md mb-4"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-md">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}

                        {/* Product Info */}
                        <h2 className="text-lg font-semibold text-gray-800 truncate">
                          {product.productName}
                        </h2>

                        <p className="text-gray-700 text-sm mt-1 capitalize">
                          {product.category}
                        </p>

                        <div className="mt-2">
                          <span className="text-gray-500 line-through mr-2">
                            ₹{product.strikeoutPrice?.toLocaleString()}
                          </span>
                          <span className="text-lg font-bold text-g2">
                            ₹{product.originalPrice?.toLocaleString()}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="mt-3 text-sm">
                          <span
                            className={`${
                              product.status === "live"
                                ? "text-green-700"
                                : "text-red-700"
                            } font-medium`}
                          >
                            {product.status.toUpperCase()}
                          </span>
                        </div>

                        {/* View Details */}
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                          <span>View Details</span>
                          <span className="text-b1 text-lg">→</span>
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
