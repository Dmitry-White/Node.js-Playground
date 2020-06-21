module.exports = (sequelize, DataTypes) => {

  const OrderItem = sequelize.define('OrderItem', {
    sku: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2)
  });

  OrderItem.associate = model => OrderItem.belongsTo(model.Order, {
    onDelete: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  });

  return OrderItem;
};
