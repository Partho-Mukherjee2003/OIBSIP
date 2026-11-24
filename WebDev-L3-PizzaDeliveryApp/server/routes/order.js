import express from "express";
import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders — notun order (custom pizza)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { baseId, sauceId, cheeseId, vegIds, address, phone } = req.body;

    const ids = [baseId, sauceId, cheeseId, ...(vegIds || [])];
    const items = await Inventory.find({ _id: { $in: ids } });

    if (items.length !== ids.length) {
      return res.status(400).json({ message: "Some items not found" });
    }

    // stock check
    for (const item of items) {
      if (item.stock <= 0) {
        return res
          .status(400)
          .json({ message: `${item.name} is out of stock` });
      }
    }

    const orderItems = items.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: 1,
    }));
    const totalAmount = items.reduce((sum, i) => sum + i.price, 0);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      address: address || {},
      phone: phone || "",
    });

    // stock komao
    for (const item of items) {
      item.stock -= 1;
      await item.save();
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/orders/cart — cart-er menu pizza order
router.post("/cart", verifyToken, async (req, res) => {
  try {
    const { items, address, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = items.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity || 1,
    }));
    const totalAmount = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      address: address || {},
      phone: phone || "",
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/orders/my — amar order gula
router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
      hiddenForUser: { $ne: true },
    }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// User cancel order — shudhu unpaid + Order Received hole
router.patch("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your order" });
    if (order.paymentStatus === "Paid")
      return res
        .status(400)
        .json({ message: "Paid order cannot be cancelled" });
    if (order.status !== "Order Received")
      return res
        .status(400)
        .json({ message: "Order already in progress, cannot cancel" });
    order.status = "Cancelled";
    order.cancelledBy = "user";
    await order.save();
    res.json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// User hide order — nijer list theke sorano
router.patch("/:id/hide", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your order" });
    order.hiddenForUser = true;
    await order.save();
    res.json({ message: "Removed from your list", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
