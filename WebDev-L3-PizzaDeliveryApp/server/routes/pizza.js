import express from "express";
import Pizza from "../models/Pizza.js";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// Get all pizzas
router.get("/pizzas", async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get inventory
router.get("/inventory", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
