import express from "express";
import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/admin/orders — shob order
router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// PATCH /api/admin/orders/:id/status — status change
router.patch(
  "/orders/:id/status",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Cancelled order cannot be updated" });
    }
    order.status = req.body.status;
    await order.save();
    res.json({ message: "Status updated", order });
  },
);

// GET /api/admin/inventory — shob inventory
router.get("/inventory", verifyToken, verifyAdmin, async (req, res) => {
  const items = await Inventory.find().sort({ category: 1 });
  res.json(items);
});

// PATCH /api/admin/inventory/:id — stock update
router.patch("/inventory/:id", verifyToken, verifyAdmin, async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  item.stock = req.body.stock;
  await item.save();
  res.json({ message: "Stock updated", item });
});
// PATCH /api/admin/orders/:id/cancel — unpaid order cancel
router.patch(
  "/orders/:id/cancel",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentStatus === "Paid") {
      return res
        .status(400)
        .json({ message: "Paid order cannot be cancelled" });
    }
    order.status = "Cancelled";
    order.cancelledBy = "admin";
    await order.save();
    res.json({ message: "Order cancelled", order });
  },
);
export default router;
