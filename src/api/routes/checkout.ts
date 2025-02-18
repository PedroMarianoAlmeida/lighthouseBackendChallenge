import express, { Request, Response } from "express";
import { calculateShoppingCart } from "./../../services/checkoutService";
import { asyncWrapper, AsyncWrapperError } from "./../../utils/asyncWrapper";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { items } = req.body;

  const response = await asyncWrapper(async () => {
    return calculateShoppingCart(items);
  });

  if (!response.success) {
    const errorResponse = response as AsyncWrapperError;
    if (errorResponse.message.includes("SKU not valid")) {
      return res.status(422).json({ error: errorResponse.message });
    }
    return res.status(500).json({ error: "Internal server error." });
  }

  return res.json(response.result);
});

export default router;
