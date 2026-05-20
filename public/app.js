const productsContainer = document.querySelector("#products");

function formatPrice(value) {
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

async function loadProducts() {
  const response = await fetch("/api/products");
  const products = await response.json();

  productsContainer.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <span class="price">${formatPrice(product.price)}</span>
        </article>
      `
    )
    .join("");
}

loadProducts().catch(() => {
  productsContainer.innerHTML =
    '<p>No se pudo cargar el catalogo en este momento.</p>';
});
