const { env } = require("../config/env.config");

function errorHandler(err, req, res, next) {
  if (env.nodeEnv === "development") {
    console.error(err);
  }

  const statusCode = err.statusCode || 500;

  if (req.path.startsWith("/api")) {
    res.status(statusCode).json({
      ok: false,
      error: err.message || "Error interno del servidor."
    });
    return;
  }

  res.status(500).render("error");
}

module.exports = { errorHandler };
