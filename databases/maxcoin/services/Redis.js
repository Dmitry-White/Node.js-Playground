const redis = require('redis');

const CoinAPI = require('../api/Coin');

const REDIS_PORT = 7379;

class RedisService {
  constructor() {
    this.coinAPI = new CoinAPI();
  }

  async connect() {
    const RedisClient = redis.createClient(REDIS_PORT);

    RedisClient.on('connect', () => {
      console.time('Redis');
      console.log('Connected successfully to Redis server');

      fetchFromAPI((err, data) => {
        if (err) throw err;

        insertRedis(RedisClient, data.bpi, (err, results) => {
          if (err) throw err;
          console.log(
            `Successfully inserted ${results} key/value pairs into Redis`,
          );

          RedisClient.zrange('values', -1, -1, 'withscores', (err, result) => {
            if (err) throw err;
            console.log(
              `Redis: The one month max value is ${result[1]} and it was reached on ${result[0]}`,
            );
            console.timeEnd('Redis');
            RedisClient.end();
          });
        });
      });
    });
  }

  async disconnect() {}

  async insert() {
    const insertRedis = (client, data, callback) => {
      const values = ['values'];

      Object.entries(data).forEach(([key, value]) => {
        values.push(value);
        values.push(key);
      });

      client.zadd(values, callback);
    };
  }
}

export default RedisService;
