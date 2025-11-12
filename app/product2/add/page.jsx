"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Your category and status options from the model
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

export default function AddProduct() {
  const [formData, setFormData] = useState({
    category: "bracelets",
    status: "live",
    productName: "",
    strikeoutPrice: "",
    originalPrice: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    description: "",
    material: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // ✅ Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false);

    // Basic validation
    const requiredFields = [
      "productName",
      "strikeoutPrice",
      "originalPrice",
      "img1",
      "img2",
      "description",
      "material",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill out the ${field} field.`);
        return;
      }
    }

    if (isNaN(formData.strikeoutPrice) || isNaN(formData.originalPrice)) {
      setError("Prices must be valid numbers.");
      return;
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
      setTimeout(() => router.push("/product2"), 2000); // redirect after success
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel and confirmation logic
  const handleCancel = () => setShowConfirmation(true);
  const handleConfirmCancel = () => router.push("/products");
  const handleDismissCancel = () => setShowConfirmation(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl bg-b3 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Category Dropdown */}
          <div>
            <label className="block font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Other Fields */}
          {Object.keys(formData)
            .filter((key) => key !== "category" && key !== "status")
            .map((key) => (
              <div key={key}>
                <label className="block font-medium mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type={
                    key.includes("Price") ? "number" : key.startsWith("img") ? "url" : "text"
                  }
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
                  required={
                    !["img3", "img4"].includes(key) // optional images
                  }
                />
                {key.startsWith("img") && formData[key] && (
                  <div className="mt-2">
                    <img
                      src={formData[key]}
                      alt={`Preview ${key}`}
                      className="w-auto h-60 object-cover rounded-lg border border-gray-300 shadow-md"
                    />
                  </div>
                )}
              </div>
            ))}

          {/* Error and Success messages */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {showSuccess && (
            <p className="text-green-500 text-center mb-4">
              Product added successfully!
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white shadow-md transition-transform transform hover:scale-105 ${
                isSubmitting ? "bg-gray-400" : "bg-b2 "
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-red-600 text-white py-3 rounded-lg shadow-md hover:bg-gray-700 transition-transform transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Cancel Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to cancel?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
              >
                Yes, Cancel
              </button>
              <button
                onClick={handleDismissCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
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
