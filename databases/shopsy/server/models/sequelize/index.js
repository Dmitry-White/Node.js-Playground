// https://github.com/sequelize/express-example/tree/master/express-main-example

function applyExtraSetup(sequelize) {
  const { Order, OrderItem } = sequelize.models;

  Order.hasMany(OrderItem);
  OrderItem.belongsTo(Order, {
    onDelete: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  });
}

module.exports = (sequelize) => {
  const modelDefiners = [
    require('./Order'),
    require('./OrderItem'),
  ];

  // We define all models according to their files.
  for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
  }

  // We execute any extra setup after the models are defined, such as adding associations.
  applyExtraSetup(sequelize);

  // Is asynchronous but we won't wait here
  sequelize.sync();

  return sequelize;
};
