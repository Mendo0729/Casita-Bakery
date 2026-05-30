const express = require("express");

const { requireAdmin } = require("../middlewares/require-admin.middleware");
const { env } = require("../config/env.config");
const {
  getAdminDashboardMetrics,
  getAdminOrders
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

router.get("/pedidos/:id", requireAdmin, (req, res) => {
  res.type("text").send("Detalle de pedido pendiente");
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
