function notFoundHandler(req, res) {
  res.status(404).render("error");
}

module.exports = { notFoundHandler };
