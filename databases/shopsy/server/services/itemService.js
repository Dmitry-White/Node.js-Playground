const ItemModel = require('../models/mongoose/Item');

async function create(data) {
  const item = new ItemModel(data);
  return item.save();
}

async function getAll() {
  return ItemModel.find({}).sort({ createdAt: -1 });
}


async function getOne(itemId) {
  return ItemModel.findOne({ _id: itemId });
}

async function update(itemId, data) {
  const item = await getOne(itemId);

  if (!item) throw new Error('Could not find the requested item');

  Object.entries(data).forEach(([key, value]) => {
    item[key] = value;
  });

  return item.save();
}

async function remove(query) {
  const result = await ItemModel.remove(query);
  return result.n;
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
}