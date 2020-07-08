const mysql = require('mysql2/promise');

const CoinAPI = require('../api/Coin');

const MYSQL_PORT = 3406;

class MySQLService {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.connection = null;
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      port: MYSQL_PORT,
      user: 'root',
      password: 'qwerty',
      database: 'maxcoin',
    });

    return this.connection;

    connection.connect((err) => {
      if (err) throw err;
      console.time('MySQL');
      console.log('Connected successfully to MySQL server');

      fetchFromAPI((err, data) => {
        if (err) throw err;

        insertMysql(connection, data.bpi, (err, results) => {
          if (err) throw err;
          console.log(
            `Successfully inserted ${results.affectedRows} documents into MySQL`,
          );

          const sql =
            'SELECT * FROM coinvalues ORDER BY coinvalue DESC LIMIT 0,1';

          connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log(
              `MySQL: The one month max value is ${result[0].coinvalue} and it was reached on ${result[0].valuedate}`,
            );
            console.timeEnd('MySQL');
            connection.end();
          });
        });
      });
    });
  }

  disconnect() {
    if (!this.connection) {
      return false;
    }

    return this.connection.end();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const values = [];

    Object.entries(data.bpi).forEach(([key, value]) => {
      values.push([key, value]);
    });

    const sql = 'INSERT INTO coinvalues (valuedate, coinvalue) VALUES ?';

    return this.connection.query(sql, [values]);
  }

  getMax() {
    const sql = 'SELECT * FROM coinvalues ORDER BY coinvalue DESC LIMIT 0,1';
    return this.connection.query(sql);
  }

  async max() {
    try {
      console.time('MySQL Connect');
      console.info('Connecting to MySQL...');

      await this.connect();

      console.info('Connected successfully to MySQL server');
      console.timeEnd('MySQL Connect');

      console.time('MySQL Insert');
      console.info('Inserting into MySQL...');

      const insertResult = await this.insert();

      console.info(
        `Successfully inserted ${insertResult[0].affectedRows} rows into MySQL`,
      );
      console.timeEnd('MySQL Insert');

      console.time('MySQL Find');
      console.info('Querying MySQL...');

      const queryResult = await this.getMax();
      const row = queryResult[0][0];

      console.log(
        `MySQL: The five year max value is ${row.coinvalue} and it was reached on ${row.valuedate}`,
      );
      console.timeEnd('MySQL Find');

      console.time('MySQL Disconnect');
      console.info('Disconnecting from MySQL...');

      await this.disconnect();

      console.info('Disconnected successfully from MySQL server');
      console.timeEnd('MySQL Disconnect');

      return row;
    } catch (error) {
      throw new Error('Something went wrong.', error);
    }
  }
}

module.exports = MySQLService;
