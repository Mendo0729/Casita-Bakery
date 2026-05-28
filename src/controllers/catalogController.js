const { getAvailableProducts } = require("../services/productService");

function getAssetVersion() {
  return process.env.RENDER_GIT_COMMIT || process.env.npm_package_version || "dev";
}

async function renderCatalog(req, res, next) {
  try {
    const products = await getAvailableProducts();

    res.render("home", {
      title: "Casita Bakery",
      subtitle: "Postres caseros y personalizados",
      assetVersion: getAssetVersion(),
      products
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  renderCatalog
};
