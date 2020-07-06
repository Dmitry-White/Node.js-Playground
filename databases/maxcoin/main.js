const MongoService = require('./services/MongoDB');

async function run() {
  const mongoService = new MongoService();
  return mongoService.max();
}

run()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
