const { insertOrderWithDetail } = require("../repositories/order.repository");

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validateOrderPayload(payload) {
  if (!payload || !payload.cliente || !payload.pedido || !Array.isArray(payload.detalle)) {
    throw createValidationError("Payload de pedido invalido.");
  }

  if (payload.detalle.length === 0) {
    throw createValidationError("El pedido debe tener al menos un producto.");
  }
}

async function createLocalOrder(payload) {
  validateOrderPayload(payload);

  return insertOrderWithDetail(payload);
}

module.exports = {
  createLocalOrder
};
