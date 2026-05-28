function requireAdmin(req, res, next) {
  if (req.session && req.session.admin === true) {
    next();
    return;
  }

  res.redirect("/admin/login");
}

module.exports = { requireAdmin };
