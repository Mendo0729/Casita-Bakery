const pool = require("../config/databaseClient");

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

module.exports = { getAdminDashboardMetrics };
