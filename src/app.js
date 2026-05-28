const express = require("express");

const { configureSession } = require("./config/session.config");
const { publicPath, viewsPath } = require("./config/paths.config");
const adminRoutes = require("./routes/admin.routes");
const apiRoutes = require("./routes/api.routes");
const catalogRoutes = require("./routes/catalogRoutes");
const { notFoundHandler } = require("./middlewares/not-found.middleware");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.set("view engine", "ejs");
app.set("views", viewsPath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(configureSession());
app.use(express.static(publicPath));

app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);
app.use("/", catalogRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
