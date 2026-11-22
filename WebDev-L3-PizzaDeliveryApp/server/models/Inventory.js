import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["base", "sauce", "cheese", "veg"],
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 100 },
  },
  { timestamps: true },
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
