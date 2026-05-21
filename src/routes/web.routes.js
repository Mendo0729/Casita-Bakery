const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/home");
});

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    app: "Casita Bakery Web"
  });
});

module.exports = router;
