const MongoService = require('./services/MongoDB');
const RedisService = require('./services/Redis');
const MySQLService = require('./services/MySQL');

async function runMongo() {
  const mongoService = new MongoService();
  return mongoService.max();
}

async function runRedis() {
  const redisService = new RedisService();
  return redisService.max();
}

async function runMySQL() {
  const mySQLService = new MySQLService();
  return mySQLService.max();
}

const run = runMySQL;

run()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
