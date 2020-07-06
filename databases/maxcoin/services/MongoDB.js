const { MongoClient } = require('mongodb');

const CoinAPI = require('../api/Coin');

const MONGO_PORT = 37017;

// A data source name (DSN) is the name for a pointer that is used by a client application to find and connect to a database.
// A connection string is a string that specifies information about a data source and the means of connecting to it.
// It is passed in code to an underlying driver or provider in order to initiate the connection.
// Whilst commonly used for a database connection, the data source could also be a spreadsheet or text file.
const DSN = `mongodb://localhost:${MONGO_PORT}`;

class MongoService {
  constructor() {
    this.coinAPI = new CoinAPI();

    this.mongoUrl = `${DSN}/maxcoin`;
    this.client = null;
    this.connection = null;
  }

  async connect() {
    const mongoClient = new MongoClient(this.mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    this.client = await mongoClient.connect();

    const db = this.client.db('maxcoin');
    this.collection = db.collection('values');

    return this.client;
  }

  disconnect() {
    if (!this.client) {
      return false;
    }

    return this.client.close();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const documents = [];

    Object.entries(data.bpi).forEach(([key, value]) => {
      const dataInsert = {
        date: key,
        value,
      };
      documents.push(dataInsert);
    });

    return this.collection.insertMany(documents);
  }

  getMax() {
    const options = { sort: [['value', 'desc']] };
    return this.collection.findOne({}, options);
  }

  async max() {
    try {
      console.time('MongoDB Connect');
      console.info('Connecting to MongoDB...');

      await this.connect();

      console.info('Connected successfully to MongoDB server');
      console.timeEnd('MongoDB Connect');

      console.time('MongoDB Insert');
      console.info('Inserting into MongoDB...');

      const insertResult = await this.insert();

      console.info(
        `Successfully inserted ${insertResult.insertedCount} documents into MongoDB`,
      );
      console.timeEnd('MongoDB Insert');

      console.time('MongoDB Find');
      console.info('Querying MongoDB...');

      const queryResult = await this.getMax();

      console.log(
        `MongoDB: The five year max value is ${queryResult.value} and it was reached on ${queryResult.date}`,
      );
      console.timeEnd('MongoDB Find');

      console.time('MongoDB Disconnect');
      console.info('Disconnecting from MongoDB...');

      await this.disconnect();

      console.info('Disconnected successfully from MongoDB server');
      console.timeEnd('MongoDB Disconnect');

      return {
        date: queryResult.date,
        value: queryResult.value,
      };
    } catch (error) {
      throw new Error('Something went wrong.', error);
    }
  }
}

module.exports = MongoService;
