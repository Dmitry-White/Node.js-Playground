const Models = require('../models/sequelize');

let client = null;
let models = null;

async function inTransaction(work) {
  const t = await client.transaction();

  try {
    await work(t);
    return t.commit();
  } catch (error) {
    t.rollback();
    throw error;
  }
};

async function create(user, items, t) {
  const order = await models.models.Order.create({
    userId: user.id,
    email: user.email,
    status: 'Not Shipped'
  }, { transaction: t });

  return Promise.all(items.map(async (item) => {
    const orderItem = await models.models.OrderItem.create({
      sku: item.sku,
      qty: item.quantity,
      price: item.price,
      name: item.name
    });
    return order.addOrderItem(orderItem, { transaction: t });
  }))
}

const initOrder = (_client) => {
  if (!_client) throw new Error('Missing Sequelize client object!');
  client = _client;
  models = Models(_client);

  return {
    inTransaction,
    create,
  }
}

module.exports = initOrder;