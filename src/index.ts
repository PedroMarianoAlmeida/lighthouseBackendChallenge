import express from "express";
import checkoutRoutes from "./api/routes/checkout";

const app = express();

app.use(express.json());

// ✅ Mount the only route directly under `/checkout`
app.use("/checkout", checkoutRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Shopping Cart API!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
