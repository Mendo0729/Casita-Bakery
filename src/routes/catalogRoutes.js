const express = require("express");

const { renderCatalog } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", renderCatalog);

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "casita-bakery-web"
  });
});

module.exports = router;
