const ItemModel = require('../models/mongoose/Item');

async function create(data) {

}

async function getAll() {
  return ItemModel.find({}).sort({ createdAt: -1 });
}


async function getOne(itemId) {
  return ItemModel.findOne({ _id: itemId });
}

async function update(itemId, data) {

}

async function remove(itemId) {

}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
}