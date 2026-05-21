const path = require("path");

const rootPath = path.resolve(__dirname, "../..");

module.exports = {
  rootPath,
  publicPath: path.join(rootPath, "src", "public"),
  viewsPath: path.join(rootPath, "src", "views"),
  uploadsPath: path.join(rootPath, "src", "public", "uploads")
};
