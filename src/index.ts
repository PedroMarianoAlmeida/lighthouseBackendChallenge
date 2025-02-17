import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello, Express with TypeScript!" });
});

app.listen(3000, () => {
  console.log(`Server running`);
});
