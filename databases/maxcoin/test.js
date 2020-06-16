// request is a module that makes http calls easier
const request = require('request');
const { MongoClient } = require('mongodb');

// A DSN is the name for a pointer that is used by a client application to find and connect to a database.
// A connection string is a string that specifies information about a data source and the means of connecting to it.
// It is passed in code to an underlying driver or provider in order to initiate the connection.
// Whilst commonly used for a database connection, the data source could also be a spreadsheet or text file.
const DSN = 'mongodb://localhost:37017';

// Generic function that fetches the closing bitcoin dates of the last month from a public API
function fetchFromAPI(callback) {

    // We are using fat arrow (=>) syntax here. This is a new way to create anonymous functions in Node
    // Please review the Node.js documentation if this looks unfamiliar to you
    request.get('https://api.coindesk.com/v1/bpi/historical/close.json', (err, raw, body) => {
        return callback(err, JSON.parse(body));
    });
}

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
}

MongoClient.connect(DSN, (err, client) => {
    if (err) throw err;
    console.log('Connected successfully to MongoDB server');

    fetchFromAPI((err, data) => {
        if (err) throw err;
        const db = client.db('maxcoin');
        const collection = db.collection('value');

        insertMongo(collection, data.bpi)
            .then(result => {
                console.log(`Successfully inserted ${result.length} document into MongoDB`);

                const options = { 'sort': [['value', 'desc']] };
                collection.findOne({}, options, (err, result) => {
                    if (err) throw err;
                    console.log(`MongoDB: The one month max value is ${result.value} and it was reached on ${result.date}`);
                    client.close();
                });

            })
            .catch(err => {
                console.log(err);
                process.exit();
            });
    });

});
