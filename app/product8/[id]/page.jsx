"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // 🧾 Allowed Purity Options (as per backend Schema)
  const purityOptions = {
    gold: ["14K", "18K", "20K", "22K", "24K"],
    silver: ["800 Silver", "900 Silver", "925 Silver", "950 Silver", "999 Silver"],
  };

  // ⚙ Fetch Product
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

  // 🚀 Update Handler
  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsUpdating(true);

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
        router.push("/product8");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update product");
      }
    } catch (error) {
      setError(error.message);
    }

    setIsUpdating(false);
  };

  // 🗑 Delete Handler
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/delete/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      });

      if (response.ok) router.push("/product8");
      else {
        const data = await response.json();
        setError(data.message || "Failed to delete product");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // 🕓 Loader
  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-b1 border-gray-300 border-solid rounded-full animate-spin"></div>
      </div>
    );

  // 🧮 Update Metal => Reset Purity if not valid
  const handleMetalChange = (value) => {
    let updatedPurity = purityOptions[value][0];
    setProduct({ ...product, metal: value, purity: updatedPurity });
  };

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center p-4 ${isUpdating && "opacity-50 pointer-events-none"}`}>
      <div className="w-full max-w-2xl bg-b3 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-b1 mb-6 text-center">Update Product</h1>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">

          {/* Category */}
          <div>
            <label className="block font-medium text-b1 mb-2">Category</label>
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
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
            <label className="block font-medium text-b1 mb-2">Status</label>
            <select
              value={product.status}
              onChange={(e) => setProduct({ ...product, status: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            >
              <option value="live">Live</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="block font-medium text-b1 mb-2">Product Name</label>
            <input
              type="text"
              value={product.productName}
              onChange={(e) => setProduct({ ...product, productName: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          {/* Making Charges */}
          <div>
            <label className="block font-medium text-b1 mb-2">Making Charges</label>
            <input
              type="number"
              value={product.makingCharges}
              onChange={(e) => setProduct({ ...product, makingCharges: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          {/* Metal Price */}
          <div>
            <label className="block font-medium text-b1 mb-2">Metal Price</label>
            <input
              type="number"
              value={product.metalPrice}
              onChange={(e) => setProduct({ ...product, metalPrice: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          {/* Gross Weight */}
          <div>
            <label className="block font-medium text-b1 mb-2">Gross Weight</label>
            <input
              type="number"
              value={product.grossWeight}
              onChange={(e) => setProduct({ ...product, grossWeight: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          {/* Net Weight */}
          <div>
            <label className="block font-medium text-b1 mb-2">Net Weight</label>
            <input
              type="number"
              value={product.netWeight}
              onChange={(e) => setProduct({ ...product, netWeight: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            />
          </div>

          {/* Metal */}
          <div>
            <label className="block font-medium text-b1 mb-2">Metal</label>
            <select
              value={product.metal}
              onChange={(e) => handleMetalChange(e.target.value)}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            >
              <option value="gold">gold</option>
              <option value="silver">silver</option>
            </select>
          </div>

          {/* Purity Dropdown with Filter */}
          <div>
            <label className="block font-medium text-b1 mb-2">Purity</label>
            <select
              value={product.purity}
              onChange={(e) => setProduct({ ...product, purity: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            >
              {purityOptions[product.metal]?.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block font-medium text-b1 mb-2">Color (Optional)</label>
            <input
              type="text"
              value={product.color ?? ""}
              onChange={(e) => setProduct({ ...product, color: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              placeholder="e.g. Yellow Gold, Rose Gold, White, Black, etc."
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium text-b1 mb-2">Gender</label>
            <select
              value={product.gender}
              onChange={(e) => setProduct({ ...product, gender: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg"
              required
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          {/* Images */}
          {["img1", "img2", "img3", "img4"].map((field, index) => (
            <div key={field}>
              <label className="block font-medium text-b1 mb-2">
                Image {index + 1} URL {index < 2 && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={product[field] ?? ""}
                onChange={(e) => setProduct({ ...product, [field]: e.target.value })}
                className="w-full px-4 py-3 border border-b1 rounded-lg"
                required={index < 2}
              />
              {product[field] && (
                <img src={product[field]} className="mt-2 w-auto h-60 rounded-lg border shadow-md" />
              )}
            </div>
          ))}

          {/* Description */}
          <div>
            <label className="block font-medium text-b1 mb-2">Description</label>
            <textarea
              rows="5"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full px-4 py-3 border border-b1 rounded-lg resize-none"
              required
            ></textarea>
          </div>

          {/* Validation Error */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-4">
            <button type="submit" className="w-full bg-b1 text-white py-3 rounded-lg">
              Update Product
            </button>
            <button type="button" onClick={() => setShowConfirm(true)} className="w-full bg-red-500 text-white py-3 rounded-lg">
              Delete
            </button>
            <button type="button" onClick={() => router.push("/product8")} className="w-full bg-gray-500 text-white py-3 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* 🌋 Confirm Delete Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Delete
              </button>
              <button onClick={() => setShowConfirm(false)} className="bg-gray-300 px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
