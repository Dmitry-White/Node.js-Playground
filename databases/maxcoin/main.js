const MongoService = require('./services/MongoDB');
const RedisService = require('./services/Redis');

async function runMongo() {
  const mongoService = new MongoService();
  return mongoService.max();
}

async function runRedis() {
  const redisService = new RedisService();
  return redisService.max();
}

const run = runRedis;

run()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
