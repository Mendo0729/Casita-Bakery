const express = require("express");

const { requireAdmin } = require("../middlewares/require-admin.middleware");
const { env } = require("../config/env.config");

const router = express.Router();

router.get("/", requireAdmin, (req, res) => {
  res.render("admin/panel", {
    title: "Panel administrativo | Casita Bakery",
    adminUser: req.session.adminUser
  });
});

router.get("/login", (req, res) => {
  if (req.session && req.session.admin) {
    res.redirect("/admin");
    return;
  }

  res.render("admin/login", {
    title: "Login administrativo | Casita Bakery",
    error: null,
    user: ""
  });
});

router.post("/login", (req, res, next) => {
  const { usuario = "", password = "" } = req.body;
  const isValidAdmin =
    usuario === env.adminUser &&
    password === env.adminPassword &&
    Boolean(env.adminUser) &&
    Boolean(env.adminPassword);

  if (!isValidAdmin) {
    res.status(401).render("admin/login", {
      title: "Login administrativo | Casita Bakery",
      error: "Usuario o contraseña incorrectos",
      user: usuario
    });
    return;
  }

  req.session.regenerate((regenerateError) => {
    if (regenerateError) {
      next(regenerateError);
      return;
    }

    req.session.admin = true;
    req.session.adminUser = usuario;

    req.session.save((saveError) => {
      if (saveError) {
        next(saveError);
        return;
      }

      res.redirect("/admin");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("connect.sid");
    res.redirect("/admin/login");
  });
});

module.exports = router;
