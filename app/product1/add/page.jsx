"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Category options
const CATEGORY_OPTIONS = [
  "bangles",
  "bracelets",
  "chains",
  "earrings",
  "necklace",
  "mencollections",
  "pendents",
  "rings",
];

const STATUS_OPTIONS = ["live", "inactive"];

// Metal & Purity options
const METAL_OPTIONS = ["gold", "silver"];

const PURITY_OPTIONS = [
  "14K",
  "18K",
  "20K",
  "22K",
  "24K",
  "800 Silver",
  "900 Silver",
  "925 Silver",
  "950 Silver",
  "999 Silver",
];

const GENDER_OPTIONS = ["men", "women", "unisex"];

export default function AddProduct() {
  const [formData, setFormData] = useState({
    category: "bangles",
    status: "live",
    productName: "",
    makingCharges: "",
    metalPrice: "",
    grossWeight: "",
    netWeight: "",
    metal: "",
    purity: "",
    color: "",
    gender: "unisex",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // Form change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false);

    // Required fields except img3 & img4
    const requiredFields = [
      "productName",
      "makingCharges",
      "metalPrice",
      "grossWeight",
      "netWeight",
      "metal",
      "purity",
      "color",
      "gender",
      "img1",
      "img2",
      "description",
      "category",
      "status",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill out the ${field} field.`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to add product");

      setShowSuccess(true);
      setTimeout(() => router.push("/product1"), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel popup controls
  const handleCancel = () => setShowConfirmation(true);
  const handleConfirmCancel = () => router.push("/products");
  const handleDismissCancel = () => setShowConfirmation(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl bg-b3 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Category */}
          <div>
            <label className="block font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="block font-medium mb-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          {/* Metal Type */}
          <div>
            <label className="block font-medium mb-2">Metal</label>
            <select
              name="metal"
              value={formData.metal}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              required
            >
              <option value="">Select Metal</option>
              {METAL_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Purity */}
          <div>
            <label className="block font-medium mb-2">Purity</label>
            <select
              name="purity"
              value={formData.purity}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              required
            >
              <option value="">Select Purity</option>
              {PURITY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              required
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block font-medium mb-2">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Ex: Yellow, White, Rose"
              required
            />
          </div>

          {/* Weights and Price fields */}
          {[
            { key: "grossWeight", label: "Gross Weight (grams)" },
            { key: "netWeight", label: "Net Weight (grams)" },
            { key: "makingCharges", label: "Making Charges" },
            { key: "metalPrice", label: "Metal Price" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block font-medium mb-2">{label}</label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>
          ))}

          {/* Images & Description */}
          {["img1", "img2", "img3", "img4", "description"].map((key) => (
            <div key={key}>
              <label className="block font-medium mb-2">{key.toUpperCase()}</label>
              <input
                type={key.startsWith("img") ? "url" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
                required={!["img3", "img4"].includes(key)}
              />
              {key.startsWith("img") && formData[key] && (
                <img src={formData[key]} className="mt-2 w-auto h-56 border rounded-lg" />
              )}
            </div>
          ))}

          {/* Messages */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {showSuccess && <p className="text-green-500 text-center mb-4">Product added successfully!</p>}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white shadow-md ${
                isSubmitting ? "bg-gray-400" : "bg-b2"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-red-600 text-white py-3 rounded-lg shadow-md hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Cancel Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to cancel?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirmCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Yes, Cancel
              </button>
              <button
                onClick={handleDismissCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                No, Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
