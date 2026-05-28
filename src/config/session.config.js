const session = require("express-session");

const { env } = require("./env.config");

function getSessionSecret() {
  if (env.sessionSecret) {
    return env.sessionSecret;
  }

  if (env.nodeEnv === "production") {
    throw new Error("Missing SESSION_SECRET environment variable.");
  }

  return "casita-bakery-development-session-secret";
}

function configureSession() {
  return session({
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax"
    }
  });
}

module.exports = { configureSession };
