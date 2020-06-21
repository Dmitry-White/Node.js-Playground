module.exports = (sequelize, DataTypes) => {

  const Order = sequelize.define('Order', {
    userId: DataTypes.STRING(24),
    email: DataTypes.STRING,
    status: DataTypes.STRING,
  });

  Order.associate = model => Order.hasMany(model.OrderItem);

  return Order;
};
