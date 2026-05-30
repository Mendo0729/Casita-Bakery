const express = require("express");

const { requireAdmin } = require("../middlewares/require-admin.middleware");
const { env } = require("../config/env.config");
const {
  getAdminDashboardMetrics,
  getAdminOrders,
  getAdminOrderDetail,
  updateAdminOrderStatus
} = require("../repositories/admin.repository");

const router = express.Router();
const ORDER_PAGE_SIZE = 10;
const ALLOWED_ORDER_FILTER_STATUSES = new Set([
  "todos",
  "pendiente",
  "en_proceso",
  "entregado",
  "cancelado"
]);
const ALLOWED_ORDER_STATUSES = [
  "pendiente",
  "en_proceso",
  "entregado",
  "cancelado"
];

function getPositivePage(value) {
  const parsedPage = Number.parseInt(value, 10);

  if (Number.isNaN(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

function getOrderFilters(query) {
  const estado = ALLOWED_ORDER_FILTER_STATUSES.has(query.estado)
    ? query.estado
    : "todos";
  const buscar = typeof query.buscar === "string" ? query.buscar.trim() : "";

  return {
    estado,
    buscar
  };
}

function buildOrdersPageUrl({ page, estado, buscar }) {
  const params = new URLSearchParams();

  if (estado && estado !== "todos") {
    params.set("estado", estado);
  }

  if (buscar) {
    params.set("buscar", buscar);
  }

  params.set("page", String(page));

  return `/admin/pedidos?${params.toString()}`;
}

function formatOrderDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("es-PA", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function normalizeOrder(order) {
  return {
    ...order,
    idCorto: String(order.id).slice(0, 8),
    totalFormateado: `$${Number(order.total).toFixed(2)}`,
    fechaFormateada: formatOrderDate(order.creado_en)
  };
}

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function formatCurrency(value) {
  return `$${Number(value).toFixed(2)}`;
}

function normalizeOrderDetail(order, detail) {
  const detailRows = detail.map((item) => ({
    ...item,
    precioUnitarioFormateado: formatCurrency(item.precio_unitario),
    subtotalFormateado: formatCurrency(item.subtotal)
  }));
  const totalCalculado = detailRows.reduce(
    (total, item) => total + Number(item.subtotal),
    0
  );
  const totalRegistrado = Number(order.total);

  return {
    order: {
      ...order,
      idCorto: String(order.id).slice(0, 8),
      totalFormateado: formatCurrency(totalRegistrado),
      fechaFormateada: formatOrderDate(order.creado_en),
      notas: order.notas || "Sin notas"
    },
    detail: detailRows,
    totalCalculado,
    totalCalculadoFormateado: formatCurrency(totalCalculado),
    totalRegistrado,
    totalRegistradoFormateado: formatCurrency(totalRegistrado),
    totalMismatch: Math.abs(totalCalculado - totalRegistrado) > 0.009
  };
}

function renderOrderDetailMessage(res, statusCode, message) {
  res.status(statusCode).render("admin/order-detail", {
    title: "Detalle de pedido | Casita Bakery",
    order: null,
    detail: [],
    totalCalculadoFormateado: "$0.00",
    totalRegistradoFormateado: "$0.00",
    totalMismatch: false,
    estadosPermitidos: ALLOWED_ORDER_STATUSES,
    message,
    error: statusCode >= 500 ? message : null
  });
}

router.get("/", requireAdmin, async (req, res) => {
  try {
    const metrics = await getAdminDashboardMetrics();

    res.render("admin/panel", {
      title: "Panel administrativo | Casita Bakery",
      adminUser: req.session.adminUser,
      metrics,
      metricsError: null
    });
  } catch (error) {
    console.error("No se pudieron cargar las metricas del panel.", error);

    res.render("admin/panel", {
      title: "Panel administrativo | Casita Bakery",
      adminUser: req.session.adminUser,
      metrics: null,
      metricsError: "No se pudieron cargar las métricas del panel."
    });
  }
});

router.get("/pedidos", requireAdmin, async (req, res) => {
  const page = getPositivePage(req.query.page);
  const filters = getOrderFilters(req.query);
  const normalizedFilters = {
    estado: filters.estado === "todos" ? "" : filters.estado,
    buscar: filters.buscar
  };

  try {
    const { orders, total } = await getAdminOrders({
      page,
      pageSize: ORDER_PAGE_SIZE,
      ...normalizedFilters
    });
    const totalPages = Math.max(1, Math.ceil(total / ORDER_PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    if (currentPage !== page) {
      res.redirect(buildOrdersPageUrl({
        page: currentPage,
        estado: filters.estado,
        buscar: filters.buscar
      }));
      return;
    }

    res.render("admin/orders", {
      title: "Pedidos | Casita Bakery",
      pedidos: orders.map(normalizeOrder),
      filters,
      pagination: {
        totalPedidos: total,
        totalPaginas: totalPages,
        paginaActual: currentPage,
        tienePaginaAnterior: currentPage > 1,
        tienePaginaSiguiente: currentPage < totalPages,
        paginaAnteriorUrl: buildOrdersPageUrl({
          page: currentPage - 1,
          estado: filters.estado,
          buscar: filters.buscar
        }),
        paginaSiguienteUrl: buildOrdersPageUrl({
          page: currentPage + 1,
          estado: filters.estado,
          buscar: filters.buscar
        })
      },
      error: null
    });
  } catch (error) {
    console.error("No se pudieron cargar los pedidos.", error);

    res.render("admin/orders", {
      title: "Pedidos | Casita Bakery",
      pedidos: [],
      filters,
      pagination: {
        totalPedidos: 0,
        totalPaginas: 1,
        paginaActual: page,
        tienePaginaAnterior: false,
        tienePaginaSiguiente: false,
        paginaAnteriorUrl: "",
        paginaSiguienteUrl: ""
      },
      error: "No se pudieron cargar los pedidos."
    });
  }
});

router.get("/pedidos/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  if (!isValidUuid(id)) {
    renderOrderDetailMessage(res, 400, "ID de pedido inválido.");
    return;
  }

  try {
    const { order, detail } = await getAdminOrderDetail(id);

    if (!order) {
      renderOrderDetailMessage(res, 404, "Pedido no encontrado.");
      return;
    }

    const viewModel = normalizeOrderDetail(order, detail);

    res.render("admin/order-detail", {
      title: "Detalle de pedido | Casita Bakery",
      ...viewModel,
      estadosPermitidos: ALLOWED_ORDER_STATUSES,
      message: null,
      error: null
    });
  } catch (error) {
    console.error("No se pudo cargar el detalle del pedido.", error);
    renderOrderDetailMessage(res, 500, "No se pudo cargar el detalle del pedido.");
  }
});

router.post("/pedidos/:id/estado", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!isValidUuid(id)) {
    renderOrderDetailMessage(res, 400, "ID de pedido inválido.");
    return;
  }

  if (!ALLOWED_ORDER_STATUSES.includes(estado)) {
    renderOrderDetailMessage(res, 400, "Estado inválido.");
    return;
  }

  try {
    const updatedOrder = await updateAdminOrderStatus(id, estado);

    if (!updatedOrder) {
      renderOrderDetailMessage(res, 404, "Pedido no encontrado.");
      return;
    }

    res.redirect(`/admin/pedidos/${updatedOrder.id}`);
  } catch (error) {
    console.error("No se pudo actualizar el estado del pedido.", error);
    renderOrderDetailMessage(res, 500, "No se pudo actualizar el estado del pedido.");
  }
});

router.get("/productos", requireAdmin, (req, res) => {
  res.type("text").send("Productos administrativos pendiente");
});

router.get("/login", (req, res) => {
  if (req.session && req.session.admin === true) {
    res.redirect("/admin");
    return;
  }

  res.render("admin/login", {
    title: "Login administrativo | Casita Bakery",
    error: null,
    user: ""
  });
});

router.post("/login", (req, res, next) => {
  const { usuario = "", password = "" } = req.body;
  const isValidAdmin =
    usuario === env.adminUser &&
    password === env.adminPassword &&
    Boolean(env.adminUser) &&
    Boolean(env.adminPassword);

  if (!isValidAdmin) {
    res.status(401).render("admin/login", {
      title: "Login administrativo | Casita Bakery",
      error: "Usuario o contraseña incorrectos",
      user: usuario
    });
    return;
  }

  req.session.regenerate((regenerateError) => {
    if (regenerateError) {
      next(regenerateError);
      return;
    }

    req.session.admin = true;
    req.session.adminUser = usuario;

    req.session.save((saveError) => {
      if (saveError) {
        next(saveError);
        return;
      }

      res.redirect("/admin");
    });
  });
});

router.get("/logout", (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax"
  };

  if (!req.session) {
    res.clearCookie("connect.sid", cookieOptions);
    res.redirect("/admin/login");
    return;
  }

  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("connect.sid", cookieOptions);
    res.redirect("/admin/login");
  });
});

module.exports = router;
