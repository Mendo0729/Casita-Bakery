function notFoundHandler(req, res) {
  if (req.path.startsWith("/api")) {
    res.status(404).json({
      ok: false,
      error: "Ruta API no encontrada."
    });
    return;
  }

  res.status(404).render("error");
}

module.exports = { notFoundHandler };
