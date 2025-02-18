import express, { Request, Response } from "express";
import {
  calculateShoppingCart,
  sanitizeItems,
} from "./../../services/checkoutService";
import { asyncWrapper, AsyncWrapperError } from "./../../utils/asyncWrapper";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const response = await asyncWrapper(async () => {
    const { items } = req.body;
    const sanitizedItems = sanitizeItems(items);
    return calculateShoppingCart(sanitizedItems);
  });

  if (!response.success) {
    const errorResponse = response as AsyncWrapperError;
    const errorMsg = errorResponse.message;
    if (
      errorMsg.includes("SKU not valid") ||
      errorMsg.includes("Invalid payload") ||
      errorMsg.includes("Each item")
    ) {
      return res.status(422).json({ error: errorMsg });
    }
    return res.status(500).json({ error: "Internal server error." });
  }

  return res.json(response.result);
});

export default router;
