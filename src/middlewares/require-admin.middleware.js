function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    next();
    return;
  }

  res.redirect("/admin/login");
}

module.exports = { requireAdmin };
