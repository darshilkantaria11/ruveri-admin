import { Schema, model, models } from "mongoose";

const itemSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ["COD", "prepaid"],
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
    },
    orderStatus: {
      type: String,
      default: "Confirmed",
      enum: ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
    // Razorpay payment details (only for prepaid orders)
    razorpayOrderId: {
      type: String,
      trim: true,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: null,
    },
    razorpaySignature: {
      type: String,
      trim: true,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const orderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    items: [itemSchema],
  },
  { timestamps: true }
);

export default models.Order || model("Order", orderSchema);