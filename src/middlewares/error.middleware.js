const { env } = require("../config/env.config");

function errorHandler(err, req, res, next) {
  if (env.nodeEnv === "development") {
    console.error(err);
  }

  res.status(500).render("error");
}

module.exports = { errorHandler };
