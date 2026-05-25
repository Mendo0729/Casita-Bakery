const pool = require("../config/databaseClient");

const FALLBACK_IMAGES_BY_NAME = {
  "Cinnamon Roll Glaseado": "https://images.unsplash.com/photo-1509365465985-25d11c17e812"
};

function getSafeImageUrl(product) {
  const imageUrl = product.imagen_url || FALLBACK_IMAGES_BY_NAME[product.nombre];

  if (FALLBACK_IMAGES_BY_NAME[product.nombre]) {
    return FALLBACK_IMAGES_BY_NAME[product.nombre];
  }

  return imageUrl;
}

function getOptimizedImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (!imageUrl.includes("images.unsplash.com")) {
    return imageUrl;
  }

  const url = new URL(imageUrl);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", "700");
  url.searchParams.set("h", "520");
  url.searchParams.set("q", "76");

  return url.toString();
}

function normalizeProduct(product) {
  const safeImageUrl = getSafeImageUrl(product);

  return {
    ...product,
    imagen_url: getOptimizedImageUrl(safeImageUrl)
  };
}

async function getAvailableProducts() {
  const { rows } = await pool.query(`
    select id, nombre, descripcion, precio, imagen_url, categoria, orden
    from productos
    where disponible = true
    order by orden asc
  `);

  return rows.map(normalizeProduct);
}

module.exports = {
  getAvailableProducts
};
