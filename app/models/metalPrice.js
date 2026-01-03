import { Schema, model, models } from "mongoose";

const metalPriceSchema = new Schema(
  {
    metal: {
      type: String,
      required: true,
      unique: true,
      enum: ["gold", "silver"],
      lowercase: true,
    }
    ,
    priceInINR: {
      type: Number, // exact (float)
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
