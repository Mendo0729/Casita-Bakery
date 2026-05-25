const carrito = [];
let pedidoEnviando = false;
let categoriaActual = "Todos";

function abrirCarrito() {
  const panel = document.getElementById("carrito-panel");
  const overlay = document.getElementById("carrito-overlay");
  const boton = document.getElementById("btn-carrito");

  if (!panel || !overlay) {
    return;
  }

  overlay.hidden = false;
  panel.removeAttribute("inert");
  panel.classList.add("is-open");
  overlay.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");

  if (boton) {
    boton.setAttribute("aria-expanded", "true");
  }

  const closeButton = panel.querySelector(".cart-close-button");

  if (closeButton) {
    closeButton.focus();
  }
}

function cerrarCarrito() {
  const panel = document.getElementById("carrito-panel");
  const overlay = document.getElementById("carrito-overlay");
  const boton = document.getElementById("btn-carrito");

  if (!panel || !overlay) {
    return;
  }

  if (boton) {
    boton.setAttribute("aria-expanded", "false");
    boton.focus();
  }

  panel.classList.remove("is-open");
  overlay.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  panel.setAttribute("inert", "");
  overlay.hidden = true;
}

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
  abrirCarrito();
}

function aumentarCantidad(productoId) {
  const producto = carrito.find((item) => item.id === productoId);

  if (!producto) {
    return;
  }

  producto.cantidad += 1;
  actualizarCarrito();
}

function disminuirCantidad(productoId) {
  const producto = carrito.find((item) => item.id === productoId);

  if (!producto) {
    return;
  }

  producto.cantidad -= 1;

  if (producto.cantidad <= 0) {
    eliminarDelCarrito(productoId);
    return;
  }

  actualizarCarrito();
}

function eliminarDelCarrito(productoId) {
  const productoIndex = carrito.findIndex((item) => item.id === productoId);

  if (productoIndex === -1) {
    return;
  }

  carrito.splice(productoIndex, 1);
  actualizarCarrito();
}

function abrirModalPedido() {
  if (carrito.length === 0) {
    return;
  }

  const modal = document.getElementById("pedido-modal");
  const overlay = document.getElementById("pedido-modal-overlay");
  const estado = document.getElementById("pedido-estado");
  const botonEnviar = document.getElementById("btn-enviar-pedido");

  if (!modal || !overlay) {
    return;
  }

  overlay.hidden = false;
  modal.removeAttribute("inert");
  modal.classList.add("is-open");
  overlay.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  if (estado) {
    estado.textContent = "";
    estado.classList.remove("is-success");
  }

  limpiarErroresFormularioPedido();

  if (botonEnviar) {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar pedido";
  }

  const nombreInput = document.getElementById("cliente-nombre");

  if (nombreInput) {
    nombreInput.focus();
  }
}

function cerrarModalPedido() {
  const modal = document.getElementById("pedido-modal");
  const overlay = document.getElementById("pedido-modal-overlay");
  const botonContinuar = document.getElementById("btn-continuar-pedido");

  if (!modal || !overlay) {
    return;
  }

  if (botonContinuar) {
    botonContinuar.focus();
  }

  modal.classList.remove("is-open");
  overlay.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("inert", "");
  overlay.hidden = true;
}

function mostrarModalGuardandoPedido() {
  const modal = document.getElementById("pedido-carga-modal");
  const overlay = document.getElementById("pedido-carga-overlay");
  const icono = document.getElementById("pedido-carga-icono");
  const titulo = document.getElementById("pedido-carga-titulo");
  const texto = document.getElementById("pedido-carga-texto");
  const accion = document.getElementById("pedido-carga-accion");

  if (!modal || !overlay || !icono || !titulo || !texto) {
    return;
  }

  icono.innerHTML = '<span class="order-spinner" aria-hidden="true"></span>';
  icono.classList.remove("is-success", "is-error");
  titulo.textContent = "Estamos guardando tu pedido...";
  texto.textContent = "Un momento mientras registramos los detalles.";

  if (accion) {
    accion.hidden = true;
  }

  overlay.hidden = false;
  modal.removeAttribute("inert");
  modal.classList.add("is-open");
  overlay.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function mostrarConfirmacionPedido() {
  const icono = document.getElementById("pedido-carga-icono");
  const titulo = document.getElementById("pedido-carga-titulo");
  const texto = document.getElementById("pedido-carga-texto");

  if (!icono || !titulo || !texto) {
    return;
  }

  icono.innerHTML = '<span aria-hidden="true">✓</span>';
  icono.classList.remove("is-error");
  icono.classList.add("is-success");
  titulo.textContent = "Pedido enviado correctamente";
  texto.textContent = "Pronto te contactaremos para confirmar tu pedido.";
}

function mostrarErrorGuardadoPedido(mensaje) {
  const icono = document.getElementById("pedido-carga-icono");
  const titulo = document.getElementById("pedido-carga-titulo");
  const texto = document.getElementById("pedido-carga-texto");
  const accion = document.getElementById("pedido-carga-accion");

  if (!icono || !titulo || !texto) {
    return;
  }

  icono.innerHTML = '<span aria-hidden="true">!</span>';
  icono.classList.remove("is-success");
  icono.classList.add("is-error");
  titulo.textContent = "No se pudo guardar el pedido";
  texto.textContent = mensaje || "Intente nuevamente en unos minutos.";

  if (accion) {
    accion.hidden = false;
  }
}

function cerrarModalCargaPedido() {
  const modal = document.getElementById("pedido-carga-modal");
  const overlay = document.getElementById("pedido-carga-overlay");
  const botonCarrito = document.getElementById("btn-carrito");

  if (!modal || !overlay) {
    return;
  }

  modal.classList.remove("is-open");
  overlay.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("inert", "");
  overlay.hidden = true;

  if (botonCarrito) {
    botonCarrito.focus();
  }
}

function mostrarModalPedidoExitoso(pedidoId) {
  const icono = document.getElementById("pedido-carga-icono");
  const titulo = document.getElementById("pedido-carga-titulo");
  const texto = document.getElementById("pedido-carga-texto");
  const accion = document.getElementById("pedido-carga-accion");

  if (!icono || !titulo || !texto) {
    return;
  }

  icono.innerHTML = '<span aria-hidden="true">&#10003;</span>';
  icono.classList.remove("is-error");
  icono.classList.add("is-success");
  titulo.textContent = "Pedido enviado correctamente";
  texto.textContent = pedidoId
    ? `Pronto te contactaremos para confirmar tu pedido. Pedido: ${pedidoId}`
    : "Pronto te contactaremos para confirmar tu pedido.";

  if (accion) {
    accion.hidden = true;
  }
}

function mostrarModalErrorPedido(mensaje) {
  const icono = document.getElementById("pedido-carga-icono");
  const titulo = document.getElementById("pedido-carga-titulo");
  const texto = document.getElementById("pedido-carga-texto");
  const accion = document.getElementById("pedido-carga-accion");

  if (!icono || !titulo || !texto) {
    return;
  }

  icono.innerHTML = '<span aria-hidden="true">!</span>';
  icono.classList.remove("is-success");
  icono.classList.add("is-error");
  titulo.textContent = "No pudimos guardar tu pedido";
  texto.textContent = mensaje || "Por favor intenta nuevamente.";

  if (accion) {
    accion.hidden = false;
    accion.textContent = "Volver al formulario";
  }
}

function cerrarModalEstadoPedido() {
  cerrarModalCargaPedido();
}

async function guardarPedidoLocal(datosCliente) {
  const total = calcularTotalCarrito();
  const endpoint =
    window.CASITA_CONFIG?.pedidosEndpoint || "http://localhost:3000/api/pedidos";
  const payload = {
    cliente: {
      nombre: datosCliente.nombre,
      telefono: datosCliente.telefono,
      direccion: datosCliente.direccion,
      notas: datosCliente.notas
    },
    pedido: {
      estado: "pendiente",
      total
    },
    detalle: carrito.map((item) => ({
      producto_id: item.id,
      nombre_producto: item.nombre,
      precio_unitario: Number(item.precio),
      cantidad: item.cantidad,
      subtotal: calcularSubtotal(item)
    }))
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el pedido.");
  }

  return response.json();
}

function calcularSubtotal(item) {
  return Number(item.precio) * Number(item.cantidad);
}

function calcularTotalCarrito() {
  return carrito.reduce((total, item) => total + calcularSubtotal(item), 0);
}

function validarTelefonoPanama(telefono) {
  return /^6\d{3}-\d{4}$/.test(telefono);
}

function mostrarError(id, mensaje) {
  const errorElement = document.getElementById(id);

  if (errorElement) {
    errorElement.textContent = mensaje;
  }
}

function limpiarErroresFormularioPedido() {
  mostrarError("error-nombre", "");
  mostrarError("error-telefono", "");
  mostrarError("error-direccion", "");
  mostrarError("error-general", "");

  const estado = document.getElementById("pedido-estado");

  if (estado) {
    estado.textContent = "";
    estado.classList.remove("is-success");
  }
}

function validarFormularioPedido() {
  limpiarErroresFormularioPedido();

  const nombre = document.getElementById("cliente-nombre")?.value.trim() || "";
  const telefono = document.getElementById("cliente-telefono")?.value.trim() || "";
  const direccion = document.getElementById("cliente-direccion")?.value.trim() || "";
  const notas = document.getElementById("cliente-notas")?.value.trim() || "";
  const datosCliente = {
    nombre,
    telefono,
    direccion,
    notas
  };
  let valido = true;

  if (carrito.length === 0) {
    mostrarError("error-general", "Agregue al menos un producto al carrito.");
    valido = false;
  }

  if (!nombre) {
    mostrarError("error-nombre", "Ingrese su nombre.");
    valido = false;
  }

  if (!telefono) {
    mostrarError("error-telefono", "Ingrese su telefono.");
    valido = false;
  } else if (!validarTelefonoPanama(telefono)) {
    mostrarError("error-telefono", "Ingrese un numero valido. Ejemplo: 6123-4567");
    valido = false;
  }

  if (!direccion) {
    mostrarError("error-direccion", "Ingrese su direccion.");
    valido = false;
  }

  return {
    valido,
    datosCliente
  };
}

function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function actualizarCarrito() {
  const carritoItems = document.getElementById("carrito-items");
  const carritoContador = document.getElementById("carrito-contador");
  const carritoTotal = document.getElementById("carrito-total");
  const botonContinuarPedido = document.getElementById("btn-continuar-pedido");
  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalPedido = calcularTotalCarrito();

  if (carritoContador) {
    carritoContador.textContent = totalProductos;
    carritoContador.setAttribute(
      "aria-label",
      `${totalProductos} ${totalProductos === 1 ? "producto" : "productos"}`
    );
  }

  if (carritoItems) {
    if (carrito.length === 0) {
      carritoItems.innerHTML = '<p class="cart-empty">Tu pedido est&aacute; vac&iacute;o.</p>';
    } else {
      carritoItems.innerHTML = carrito.map((item) => {
        const subtotal = calcularSubtotal(item);
        const precio = Number(item.precio);

        return `
          <article class="cart-item">
            <div class="cart-item-main">
              <h3>${escaparHtml(item.nombre)}</h3>
              <p>Precio: $${precio.toFixed(2)}</p>
            </div>
            <div class="cart-item-summary">
              <strong class="cart-item-subtotal">$${subtotal.toFixed(2)}</strong>
              <div class="cart-quantity-controls" aria-label="Cantidad de ${escaparHtml(item.nombre)}">
                <button class="cart-quantity-button" type="button" data-cart-action="decrease" data-product-id="${escaparHtml(item.id)}" aria-label="Disminuir cantidad de ${escaparHtml(item.nombre)}">-</button>
                <span class="cart-quantity-value">${item.cantidad}</span>
                <button class="cart-quantity-button" type="button" data-cart-action="increase" data-product-id="${escaparHtml(item.id)}" aria-label="Aumentar cantidad de ${escaparHtml(item.nombre)}">+</button>
              </div>
              <button class="cart-remove-button" type="button" data-cart-action="remove" data-product-id="${escaparHtml(item.id)}">Eliminar</button>
            </div>
          </article>
        `;
      }).join("");
    }
  }

  if (carritoTotal) {
    carritoTotal.textContent = `$${totalPedido.toFixed(2)}`;
  }

  if (botonContinuarPedido) {
    botonContinuarPedido.disabled = carrito.length === 0;
  }
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

function normalizarCategoria(categoria) {
  return String(categoria || "").trim().toLowerCase();
}

function filtrarProductos(categoria) {
  categoriaActual = categoria;

  const productos = document.querySelectorAll(".product-card");
  const filtros = document.querySelectorAll("#filtros-categorias [data-categoria]");
  const categoriaFiltrada = normalizarCategoria(categoriaActual);

  productos.forEach((producto) => {
    const categoriaProducto = normalizarCategoria(producto.dataset.categoria);
    const coincide =
      categoriaActual === "Todos" || categoriaProducto === categoriaFiltrada;

    producto.hidden = !coincide;
  });

  filtros.forEach((filtro) => {
    const estaActivo = normalizarCategoria(filtro.dataset.categoria) === categoriaFiltrada;

    filtro.classList.toggle("is-active", estaActivo);
    filtro.setAttribute("aria-pressed", String(estaActivo));
  });
}

function configurarFiltrosCategorias() {
  const filtros = document.querySelectorAll("#filtros-categorias [data-categoria]");

  filtros.forEach((filtro) => {
    filtro.setAttribute(
      "aria-pressed",
      String(normalizarCategoria(filtro.dataset.categoria) === normalizarCategoria(categoriaActual))
    );
    filtro.addEventListener("click", () => {
      filtrarProductos(filtro.dataset.categoria);
    });
  });

  filtrarProductos(categoriaActual);
}

function configurarDrawerCarrito() {
  const botonCarrito = document.getElementById("btn-carrito");
  const overlay = document.getElementById("carrito-overlay");
  const botonCerrar = document.querySelector(".cart-close-button");

  if (botonCarrito) {
    botonCarrito.addEventListener("click", abrirCarrito);
  }

  if (overlay) {
    overlay.addEventListener("click", cerrarCarrito);
  }

  if (botonCerrar) {
    botonCerrar.addEventListener("click", cerrarCarrito);
  }
}

function configurarControlesCarrito() {
  const carritoItems = document.getElementById("carrito-items");

  if (!carritoItems) {
    return;
  }

  carritoItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");

    if (!button) {
      return;
    }

    const productoId = button.dataset.productId;
    const action = button.dataset.cartAction;

    if (action === "increase") {
      aumentarCantidad(productoId);
      return;
    }

    if (action === "decrease") {
      disminuirCantidad(productoId);
      return;
    }

    if (action === "remove") {
      eliminarDelCarrito(productoId);
    }
  });
}

function limpiarFormularioPedido() {
  const formulario = document.getElementById("pedido-form");
  const botonEnviar = document.getElementById("btn-enviar-pedido");

  if (formulario) {
    formulario.reset();
  }

  if (botonEnviar) {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar pedido";
  }

  limpiarErroresFormularioPedido();
}

function finalizarPedidoExitoso(pedidoId) {
  mostrarModalPedidoExitoso(pedidoId);

  setTimeout(() => {
    cerrarModalEstadoPedido();
    cerrarCarrito();
    limpiarFormularioPedido();
    carrito.length = 0;
    actualizarCarrito();
  }, 2600);
}

function manejarErrorPedido(error) {
  const botonEnviar = document.getElementById("btn-enviar-pedido");

  if (botonEnviar) {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar pedido";
  }

  mostrarModalErrorPedido(error?.message || "Por favor intenta nuevamente.");
}

async function enviarPedido(event) {
  event.preventDefault();

  if (pedidoEnviando) {
    return;
  }

  const botonEnviar = document.getElementById("btn-enviar-pedido");
  const { valido, datosCliente } = validarFormularioPedido();

  if (!valido) {
    return;
  }

  pedidoEnviando = true;

  if (botonEnviar) {
    botonEnviar.disabled = true;
    botonEnviar.textContent = "Enviando...";
  }

  cerrarModalPedido();
  mostrarModalGuardandoPedido();

  try {
    const resultado = await guardarPedidoLocal(datosCliente);
    finalizarPedidoExitoso(resultado.pedido_id || resultado.pedido?.id);
  } catch (error) {
    manejarErrorPedido(error);
  } finally {
    pedidoEnviando = false;
  }
}

function configurarFormularioPedido() {
  const formulario = document.getElementById("pedido-form");
  const botonContinuar = document.getElementById("btn-continuar-pedido");
  const modalOverlay = document.getElementById("pedido-modal-overlay");
  const botonCerrarModal = document.querySelector(".order-modal-close");
  const botonAccionCarga = document.getElementById("pedido-carga-accion");

  if (botonContinuar) {
    botonContinuar.addEventListener("click", abrirModalPedido);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", cerrarModalPedido);
  }

  if (botonCerrarModal) {
    botonCerrarModal.addEventListener("click", cerrarModalPedido);
  }

  if (botonAccionCarga) {
    botonAccionCarga.addEventListener("click", () => {
      cerrarModalEstadoPedido();
      abrirModalPedido();
    });
  }

  if (!formulario) {
    return;
  }

  formulario.addEventListener("submit", enviarPedido);
}

document.addEventListener("DOMContentLoaded", () => {
  configurarBotonesAgregarAlPedido();
  configurarFiltrosCategorias();
  configurarDrawerCarrito();
  configurarControlesCarrito();
  configurarFormularioPedido();
  actualizarCarrito();
});

window.carrito = carrito;
window.agregarAlCarrito = agregarAlCarrito;
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.filtrarProductos = filtrarProductos;
window.calcularSubtotal = calcularSubtotal;
window.calcularTotalCarrito = calcularTotalCarrito;
window.validarTelefonoPanama = validarTelefonoPanama;
window.validarFormularioPedido = validarFormularioPedido;
window.abrirModalPedido = abrirModalPedido;
window.cerrarModalPedido = cerrarModalPedido;
window.mostrarModalGuardandoPedido = mostrarModalGuardandoPedido;
window.mostrarModalPedidoExitoso = mostrarModalPedidoExitoso;
window.mostrarModalErrorPedido = mostrarModalErrorPedido;
window.cerrarModalEstadoPedido = cerrarModalEstadoPedido;
window.guardarPedidoLocal = guardarPedidoLocal;
window.limpiarFormularioPedido = limpiarFormularioPedido;
window.finalizarPedidoExitoso = finalizarPedidoExitoso;
window.manejarErrorPedido = manejarErrorPedido;
window.enviarPedido = enviarPedido;
window.actualizarCarrito = actualizarCarrito;
