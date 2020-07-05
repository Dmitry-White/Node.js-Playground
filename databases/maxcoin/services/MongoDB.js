const { MongoClient } = require('mongodb');

const CoinAPI = require('../api/Coin');

const MONGO_PORT = 37017;

class MongoService {
  constructor() {
    this.coinAPI = new CoinAPI();
  }

  async connect() {
    // A data source name (DSN) is the name for a pointer that is used by a client application to find and connect to a database.
    // A connection string is a string that specifies information about a data source and the means of connecting to it.
    // It is passed in code to an underlying driver or provider in order to initiate the connection.
    // Whilst commonly used for a database connection, the data source could also be a spreadsheet or text file.
    const DSN = `mongodb://localhost:${MONGO_PORT}`;

    MongoClient.connect(DSN, (err, client) => {
      console.time('MongoDB');
      if (err) throw err;
      console.log('Connected successfully to MongoDB server');

      fetchFromAPI((err, data) => {
        if (err) throw err;
        const db = client.db('maxcoin');
        const collection = db.collection('value');

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
              console.timeEnd('MongoDB');
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

  async disconnect() {}

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
}

module.exports = MongoService;
