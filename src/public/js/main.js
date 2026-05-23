const carrito = [];

function agregarAlCarrito(producto) {
  const productoExistente = carrito.find((item) => item.id === producto.id);
  const precio = Number(producto.precio);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio,
      imagen_url: producto.imagen_url,
      cantidad: 1
    });
  }

  actualizarCarrito();
}

function actualizarCarrito() {
  const carritoItems = document.getElementById("carrito-items");
  const carritoContador = document.getElementById("carrito-contador");
  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

  if (carritoContador) {
    carritoContador.textContent = `${totalProductos} ${totalProductos === 1 ? "producto" : "productos"}`;
  }

  if (carritoItems) {
    if (carrito.length === 0) {
      carritoItems.innerHTML = '<p class="cart-empty">Tu pedido está vacío.</p>';
    } else {
      carritoItems.innerHTML = carrito.map((item) => {
        const subtotal = item.precio * item.cantidad;

        return `
          <article class="cart-item">
            <div class="cart-item-info">
              <h3>${item.nombre}</h3>
              <p>Precio: $${item.precio.toFixed(2)}</p>
              <p>Cantidad: ${item.cantidad}</p>
            </div>
            <strong class="cart-item-subtotal">$${subtotal.toFixed(2)}</strong>
          </article>
        `;
      }).join("");
    }
  }

  console.log(carrito);
}

function obtenerProductoDesdeBoton(button) {
  return {
    id: button.dataset.productId,
    nombre: button.dataset.productName,
    precio: Number(button.dataset.productPrice),
    imagen_url: button.dataset.productImage
  };
}

function configurarBotonesAgregarAlPedido() {
  const botones = document.querySelectorAll(".add-to-cart-button");

  botones.forEach((button) => {
    button.addEventListener("click", () => {
      const producto = obtenerProductoDesdeBoton(button);
      agregarAlCarrito(producto);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarBotonesAgregarAlPedido();
  actualizarCarrito();
});

window.carrito = carrito;
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCarrito = actualizarCarrito;
