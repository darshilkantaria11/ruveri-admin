import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    strikeoutPrice: {
      type: Number,
      required: [true, "Strikeout price is required"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
    },
    img1: {
      type: String,
      required: [true, "Image 1 is required"],
    },
    img2: {
      type: String,
      required: [true, "Image 2 is required"],
    },
    img3: {
      type: String, // Optional
      required: false,
    },
    img4: {
      type: String, // Optional
      required: false,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    material: {
      type: String,
      required: [true, "Material is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "bangles",
        "bracelets",
        "chains",
        "earrings",
        "necklace",
        "mencollections",
        "pendents",
        "rings",
      ],
      default: "rings",
    },
    status: {
      type: String,
      enum: ["live", "inactive"],
      default: "live",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Product || model("Product", productSchema);
