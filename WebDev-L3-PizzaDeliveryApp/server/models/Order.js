import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Order Received", "In Kitchen", "Sent to Delivery", "Cancelled"],
      default: "Order Received",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    address: {
      country: { type: String, default: "" },
      state: { type: String, default: "" },
      city: { type: String, default: "" },
      details: { type: String, default: "" },
    },
    phone: { type: String, default: "" },
    cancelledBy: {
      type: String,
      enum: ["user", "admin"],
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
