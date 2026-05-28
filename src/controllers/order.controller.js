const { createLocalOrder } = require("../services/order.service");

async function createOrder(req, res, next) {
  try {
    const order = await createLocalOrder(req.body);

    res.status(201).json({
      ok: true,
      pedido_id: order.id,
      pedido: order
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder
};
