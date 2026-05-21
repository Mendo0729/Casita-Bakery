const { getAvailableProducts } = require("../services/productService");

async function renderCatalog(req, res, next) {
  try {
    const products = await getAvailableProducts();

    res.render("home", {
      title: "Casita Bakery",
      subtitle: "Postres caseros y personalizados",
      products
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  renderCatalog
};
