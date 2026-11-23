import express from "express";
import Review from "../models/Review.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/reviews — logged-in user review dibe
router.post("/", verifyToken, async (req, res) => {
  try {
    const { message, rating } = req.body;
    if (!message || !rating) {
      return res
        .status(400)
        .json({ message: "Message and rating are required" });
    }

    const user = await User.findById(req.user.id).select("-password");

    const review = await Review.create({
      user: user._id,
      name: user.name,
      email: user.email,
      image: user.image || "",
      message,
      rating,
    });

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/reviews — shudhu 4-5 star review dekhabe
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ rating: { $gte: 4 } }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
