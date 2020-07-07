const redis = require('redis');

const CoinAPI = require('../api/Coin');

const REDIS_PORT = 7379;

// A data source name (DSN) is the name for a pointer that is used by a client application to find and connect to a database.
// A connection string is a string that specifies information about a data source and the means of connecting to it.
// It is passed in code to an underlying driver or provider in order to initiate the connection.
// Whilst commonly used for a database connection, the data source could also be a spreadsheet or text file.
const DSN = `redis://localhost:${REDIS_PORT}`;

class RedisService {
  constructor() {
    this.coinAPI = new CoinAPI();

    this.client = null;
  }

  async connect() {
    this.client = redis.createClient({
      url: DSN,
    });

    await this.client.connect();

    return this.client;
  }

  disconnect() {
    if (!this.client) {
      return false;
    }

    return this.client.disconnect();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const values = [];

    Object.entries(data.bpi).forEach(([key, value]) => {
      const dataInsert = {
        score: value,
        value: key,
      };
      values.push(dataInsert);
    });

    return this.client.zAdd('maxcoin:values', values);
  }

  getMax() {
    const min = -1;
    const max = -1;
    const options = 'WITHSCORES';
    return this.client.zRange('maxcoin:values', min, max, options);
  }

  async max() {
    try {
      console.time('Redis Connect');
      console.info('Connecting to Redis...');

      await this.connect();

      console.info('Connected successfully to Redis server');
      console.timeEnd('Redis Connect');

      console.time('Redis Insert');
      console.info('Inserting into Redis...');

      const insertResult = await this.insert();

      console.info(
        `Successfully inserted ${insertResult} key/value pairs into Redis`,
      );
      console.timeEnd('Redis Insert');

      console.time('Redis Find');
      console.info('Querying Redis...');

      const queryResult = await this.getMax();

      console.log(
        `Redis: The five year max value is ${queryResult.value} and it was reached on ${queryResult.date}`,
      );
      console.timeEnd('Redis Find');

      console.time('Redis Disconnect');
      console.info('Disconnecting from Redis...');

      await this.disconnect();

      console.info('Disconnected successfully from Redis server');
      console.timeEnd('Redis Disconnect');

      return queryResult;
    } catch (error) {
      throw new Error('Something went wrong.', error);
    }
  }
}

module.exports = RedisService;
