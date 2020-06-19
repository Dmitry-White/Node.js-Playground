let client = null;

async function add(itemId, userId) {
  return new Promise((resolve, reject) => {
    client.hget(`basket: ${userId}`, itemId, (err, data) => {
      if (err) return reject(err);
      if (!data) {
        return client.hset(`basket: ${userId}`, itemId, 1, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        })
      }
      return client.hincrby(`basket: ${userId}`, itemId, 1, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      })
    })
  });
}

async function getAll() {

};

async function remove(itemId, userId) {

}

const initBasket = (_client) => {
  if (!_client) throw new Error('Missing Redis client object!');
  client = _client;

  return {
    add,
    getAll,
    remove,
  }
}

module.exports = initBasket;