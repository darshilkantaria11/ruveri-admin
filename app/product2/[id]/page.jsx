"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/fetch/${id}`, {
          method: "GET",
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/products/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => router.push("/product2"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update product");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      });

      if (response.ok) router.push("/product2");
      else {
        const data = await response.json();
        setError(data.message || "Failed to delete product");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => setShowCancelConfirm(true);

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-b1 border-gray-300 border-solid rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-b3 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-b1 mb-6 text-center">
          Product Details
        </h1>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">
          {/* Category */}
          <div>
            <label className="block text-base font-medium text-b1 mb-2">
              Category
            </label>
            <select
              value={product.category || "bracelets"}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            >
              <option value="bangles">Bangles</option>
              <option value="bracelets">Bracelets</option>
              <option value="chains">Chains</option>
              <option value="earrings">Earrings</option>
              <option value="necklace">Necklace</option>
              <option value="mencollections">Men Collections</option>
              <option value="pendents">Pendents</option>
              <option value="rings">Rings</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-base font-medium text-b1 mb-2">
              Status
            </label>
            <select
              value={product.status || "live"}
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            >
              <option value="live">Live</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Product Fields */}
          <div>
            <label className="block text-base font-medium text-b1 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={product.productName}
              onChange={(e) =>
                setProduct({ ...product, productName: e.target.value })
              }
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-b1 mb-2">
              Strikeout Price
            </label>
            <input
              type="number"
              value={product.strikeoutPrice}
              onChange={(e) =>
                setProduct({ ...product, strikeoutPrice: e.target.value })
              }
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-b1 mb-2">
              Original Price
            </label>
            <input
              type="number"
              value={product.originalPrice}
              onChange={(e) =>
                setProduct({ ...product, originalPrice: e.target.value })
              }
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          {/* Images (1–4) */}
          {["img1", "img2", "img3", "img4"].map((field, index) => (
            <div key={field}>
              <label className="block text-base font-medium text-b1 mb-2">
                Image {index + 1} URL {index < 2 && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={product[field] || ""}
                onChange={(e) =>
                  setProduct({ ...product, [field]: e.target.value })
                }
                className="w-full px-4 py-3 border border-b1 rounded-lg"
                required={index < 2}
              />
              {product[field] && (
                <div className="mt-2">
                  <img
                    src={product[field]}
                    alt={`Preview ${field}`}
                    className="w-auto h-60 object-cover rounded-lg border border-gray-300 shadow-md"
                  />
                </div>
              )}
            </div>
          ))}

          {/* Description */}
          <div>
            <label className="block text-base font-medium text-b1 mb-2">
              Description
            </label>
            <textarea
              rows="5"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-b1 rounded-lg resize-none"
              required
            ></textarea>
          </div>

          {/* Material */}
          <div>
            <label className="block text-base font-medium text-b1 mb-2">
              Material
            </label>
            <input
              type="text"
              value={product.material}
              onChange={(e) =>
                setProduct({ ...product, material: e.target.value })
              }
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          {/* Buttons */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-b1 text-white py-3 rounded-lg hover:bg-b1"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
            >
              Delete Product
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
