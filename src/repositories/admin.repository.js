const pool = require("../config/databaseClient");

const ALLOWED_ORDER_STATUSES = new Set([
  "pendiente",
  "en_proceso",
  "entregado",
  "cancelado"
]);

function buildOrdersWhereClause(filters) {
  const conditions = [];
  const values = [];

  if (ALLOWED_ORDER_STATUSES.has(filters.estado)) {
    values.push(filters.estado);
    conditions.push(`estado = $${values.length}`);
  }

  if (filters.buscar) {
    values.push(`%${filters.buscar}%`);
    conditions.push(`(
      nombre_cliente ILIKE $${values.length}
      OR telefono ILIKE $${values.length}
    )`);
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    values
  };
}

async function getAdminDashboardMetrics() {
  const [
    totalProductosResult,
    productosDisponiblesResult,
    productosNoDisponiblesResult,
    totalPedidosResult,
    pedidosPendientesResult,
    pedidosEnProcesoResult,
    pedidosEntregadosResult,
    pedidosCanceladosResult
  ] = await Promise.all([
    pool.query("SELECT COUNT(*) AS total_productos FROM productos;"),
    pool.query(`
      SELECT COUNT(*) AS productos_disponibles
      FROM productos
      WHERE disponible = true;
    `),
    pool.query(`
      SELECT COUNT(*) AS productos_no_disponibles
      FROM productos
      WHERE disponible = false;
    `),
    pool.query("SELECT COUNT(*) AS total_pedidos FROM pedidos;"),
    pool.query(`
      SELECT COUNT(*) AS pedidos_pendientes
      FROM pedidos
      WHERE estado = 'pendiente';
    `),
    pool.query(`
      SELECT COUNT(*) AS pedidos_en_proceso
      FROM pedidos
      WHERE estado = 'en_proceso';
    `),
    pool.query(`
      SELECT COUNT(*) AS pedidos_entregados
      FROM pedidos
      WHERE estado = 'entregado';
    `),
    pool.query(`
      SELECT COUNT(*) AS pedidos_cancelados
      FROM pedidos
      WHERE estado = 'cancelado';
    `)
  ]);

  return {
    totalProductos: Number(totalProductosResult.rows[0].total_productos),
    productosDisponibles: Number(productosDisponiblesResult.rows[0].productos_disponibles),
    productosNoDisponibles: Number(productosNoDisponiblesResult.rows[0].productos_no_disponibles),
    totalPedidos: Number(totalPedidosResult.rows[0].total_pedidos),
    pedidosPendientes: Number(pedidosPendientesResult.rows[0].pedidos_pendientes),
    pedidosEnProceso: Number(pedidosEnProcesoResult.rows[0].pedidos_en_proceso),
    pedidosEntregados: Number(pedidosEntregadosResult.rows[0].pedidos_entregados),
    pedidosCancelados: Number(pedidosCanceladosResult.rows[0].pedidos_cancelados)
  };
}

async function getAdminOrders({ page, pageSize, estado, buscar }) {
  const { whereClause, values } = buildOrdersWhereClause({ estado, buscar });
  const paginationValues = [...values, pageSize, (page - 1) * pageSize];
  const limitParam = values.length + 1;
  const offsetParam = values.length + 2;

  const [ordersResult, countResult] = await Promise.all([
    pool.query(
      `
        SELECT
          id,
          nombre_cliente,
          telefono,
          direccion,
          notas,
          estado,
          total,
          creado_en
        FROM pedidos
        ${whereClause}
        ORDER BY creado_en DESC
        LIMIT $${limitParam} OFFSET $${offsetParam};
      `,
      paginationValues
    ),
    pool.query(
      `
        SELECT COUNT(*) AS total
        FROM pedidos
        ${whereClause};
      `,
      values
    )
  ]);

  return {
    orders: ordersResult.rows,
    total: Number(countResult.rows[0].total)
  };
}

async function getAdminOrderDetail(orderId) {
  const [orderResult, detailResult] = await Promise.all([
    pool.query(
      `
        SELECT
          id,
          nombre_cliente,
          telefono,
          direccion,
          notas,
          estado,
          total,
          creado_en
        FROM pedidos
        WHERE id = $1;
      `,
      [orderId]
    ),
    pool.query(
      `
        SELECT
          id,
          pedido_id,
          producto_id,
          nombre_producto,
          precio_unitario,
          cantidad,
          subtotal,
          creado_en
        FROM pedido_detalle
        WHERE pedido_id = $1
        ORDER BY creado_en ASC;
      `,
      [orderId]
    )
  ]);

  return {
    order: orderResult.rows[0] || null,
    detail: detailResult.rows
  };
}

module.exports = {
  getAdminDashboardMetrics,
  getAdminOrders,
  getAdminOrderDetail
};
