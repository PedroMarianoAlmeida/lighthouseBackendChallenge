import express from "express";
import { calculateShoppingCart } from "./../../services/checkoutService";

const router = express.Router();

router.post("/", (req, res) => {
  const { items } = req.body;

  // Sanitize the items to match with Types

  try {
    const checkout = calculateShoppingCart(items);
    res.json(checkout);
  } catch (error) {
    res.status(500).json({ error: "Error processing checkout." });
  }

  console.log({ items });
  res.json({ message: "Hello, Checkout API!" });
});

export default router;
