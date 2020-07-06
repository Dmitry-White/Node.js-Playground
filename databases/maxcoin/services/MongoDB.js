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

    MongoClient.connect(DSN, (err, client) => {
      if (err) throw err;

      fetchFromAPI((err, data) => {
        if (err) throw err;

        insertMongo(collection, data.bpi)
          .then((result) => {
            console.log(
              `Successfully inserted ${result.length} document into MongoDB`,
            );

            const options = { sort: [['value', 'desc']] };
            collection.findOne({}, options, (err, result) => {
              if (err) throw err;
              console.log(
                `MongoDB: The one month max value is ${result.value} and it was reached on ${result.date}`,
              );
              client.close();
            });
          })
          .catch((err) => {
            console.log(err);
            process.exit();
          });
      });
    });
  }

  async disconnect() {
    if (!this.client) {
      return false;
    }

    this.client.close();
  }

  async insert() {
    const insertMongo = (collection, data) => {
      const promisedInserts = [];

      Object.entries(data).forEach(([key, value]) => {
        const dataInsert = collection.insertOne({
          date: key,
          value,
        });
        promisedInserts.push(dataInsert);
      });

      return Promise.all(promisedInserts);
    };
  }

  async max() {
    console.time('MongoDB');
    console.info('Connecting to MongoDB...');

    try {
      const client = await this.connect();
      console.info('Connected successfully to MongoDB server');
    } catch (error) {
      throw new Error('Connection to MongoDB failed.', error);
    }

    console.timeEnd('MongoDB');

    console.time('MongoDB');
    console.info('Disconnecting from MongoDB...');

    try {
      const client = await this.disconnect();
      console.info('Disconnected successfully from MongoDB server');
    } catch (error) {
      throw new Error('Disconnection from MongoDB failed.', error);
    }

    console.timeEnd('MongoDB');
  }
}

module.exports = MongoService;
