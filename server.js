const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Pan artesanal",
      description: "Pan recien horneado con corteza crujiente.",
      price: 3.5
    },
    {
      id: 2,
      name: "Cupcake de vainilla",
      description: "Bizcocho suave con crema de vainilla.",
      price: 2.25
    },
    {
      id: 3,
      name: "Cheesecake de fresa",
      description: "Porcion cremosa con salsa de fresa.",
      price: 4.75
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Casita Bakery disponible en http://localhost:${PORT}`);
});
