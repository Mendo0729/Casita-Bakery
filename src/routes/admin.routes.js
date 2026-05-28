const express = require("express");

const { requireAdmin } = require("../middlewares/require-admin.middleware");

const router = express.Router();

router.get("/", requireAdmin, (req, res) => {
  res.type("text").send("Panel administrativo Casita Bakery");
});

router.get("/login", (req, res) => {
  res.type("text").send("Login administrativo pendiente");
});

module.exports = router;
