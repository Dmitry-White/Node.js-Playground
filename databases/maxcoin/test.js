// request is a module that makes http calls easier
const request = require('request');
const { MongoClient } = require('mongodb');
const redis = require('redis');
const mysql = require('mysql2');

const REDIS_PORT = 7379;

const RedisClient = redis.createClient(REDIS_PORT);

// A data source name (DSN) is the name for a pointer that is used by a client application to find and connect to a database.
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
};

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

MongoClient.connect(DSN, (err, client) => {
    console.time('MongoDB');
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
                    console.timeEnd('MongoDB');
                    client.close();
                });

            })
            .catch(err => {
                console.log(err);
                process.exit();
            });
    });

});

const insertRedis = (client, data, callback) => {
    const values = ['values'];

    Object.entries(data).forEach(([key, value]) => {
        values.push(value);
        values.push(key);
    });

    client.zadd(values, callback);
};

RedisClient.on('connect', () => {
    console.time('Redis');
    console.log('Connected successfully to Redis server');

    fetchFromAPI((err, data) => {
        if (err) throw err;

        insertRedis(RedisClient, data.bpi, (err, results) => {
            if (err) throw err;
            console.log(`Successfully inserted ${results} key/value pairs into Redis`);

            RedisClient.zrange('values', -1, -1, 'withscores', (err, result) => {
                if (err) throw err;
                console.log(`Redis: The one month max value is ${result[1]} and it was reached on ${result[0]}`);
                console.timeEnd('Redis');
                RedisClient.end();
            });
        })
    });
});

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3406,
    user: 'root',
    password: 'mypassword',
    database: 'maxcoin'
});

connection.connect((err) => {
    if (err) throw err;
    console.time('MySQL');
    console.log('Connected successfully to MySQL server');
    console.timeEnd('MySQL');
    connection.end();
})