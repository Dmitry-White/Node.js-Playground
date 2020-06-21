const Models = require('../models/sequelize');

let client = null;
let models = null;

const initOrder = (_client) => {
  if (!_client) throw new Error('Missing Sequelize client object!');
  client = _client;
  models = Models(_client);

  return {}
}

module.exports = initOrder;