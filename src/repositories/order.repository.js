const pool = require("../config/databaseClient");

async function insertOrderHeader(payload) {
  const { cliente, pedido } = payload;
  const { rows } = await pool.query(
    `
      insert into pedidos (
        nombre_cliente,
        telefono,
        direccion,
        notas,
        estado,
        total
      )
      values ($1, $2, $3, $4, $5, $6)
      returning id, nombre_cliente, telefono, direccion, notas, estado, total, creado_en
    `,
    [
      cliente.nombre,
      cliente.telefono,
      cliente.direccion,
      cliente.notas || null,
      "pendiente",
      Number(pedido.total)
    ]
  );

  return rows[0];
}

async function insertOrderWithDetail(payload) {
  const client = await pool.connect();
  const { cliente, pedido, detalle } = payload;

  try {
    await client.query("begin");

    const orderResult = await client.query(
      `
        insert into pedidos (
          nombre_cliente,
          telefono,
          direccion,
          notas,
          estado,
          total
        )
        values ($1, $2, $3, $4, $5, $6)
        returning id, nombre_cliente, telefono, direccion, notas, estado, total, creado_en
      `,
      [
        cliente.nombre,
        cliente.telefono,
        cliente.direccion,
        cliente.notas || null,
        pedido.estado || "pendiente",
        Number(pedido.total)
      ]
    );

    const savedOrder = orderResult.rows[0];
    const savedDetail = [];
    const detailRows = detalle.map((item) => {
      const precioUnitario = Number(item.precio_unitario);
      const cantidad = Number(item.cantidad);

      return {
        pedido_id: savedOrder.id,
        producto_id: item.producto_id,
        nombre_producto: item.nombre_producto,
        precio_unitario: precioUnitario,
        cantidad,
        subtotal: precioUnitario * cantidad
      };
    });

    for (const item of detailRows) {
      const detailResult = await client.query(
        `
          insert into pedido_detalle (
            pedido_id,
            producto_id,
            nombre_producto,
            precio_unitario,
            cantidad,
            subtotal
          )
          values ($1, $2, $3, $4, $5, $6)
          returning id, pedido_id, producto_id, nombre_producto, precio_unitario, cantidad, subtotal, creado_en
        `,
        [
          item.pedido_id,
          item.producto_id,
          item.nombre_producto,
          item.precio_unitario,
          item.cantidad,
          item.subtotal
        ]
      );

      savedDetail.push(detailResult.rows[0]);
    }

    await client.query("commit");

    return {
      ...savedOrder,
      detalle: savedDetail
    };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  insertOrderHeader,
  insertOrderWithDetail
};
