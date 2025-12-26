import { Schema, model, models } from "mongoose";

const metalPriceSchema = new Schema(
  {
    metal: {
      type: String, // GOLD | SILVER
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    priceInINR: {
      type: Number,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default models.MetalPrice ||
  model("MetalPrice", metalPriceSchema);
