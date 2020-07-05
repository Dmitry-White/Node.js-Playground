const mysql = require('mysql2');

const CoinAPI = require('../api/Coin');

const MYSQL_PORT = 3406;

class MySQLService {
  constructor() {
    this.coinAPI = new CoinAPI();
  }

  async connect() {
    const connection = mysql.createConnection({
      host: 'localhost',
      port: MYSQL_PORT,
      user: 'root',
      password: 'mypassword',
      database: 'maxcoin',
    });

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

  async disconnect() {}

  async insert() {
    const insertMysql = (connection, data, callback) => {
      const values = [];

      const sql = 'INSERT INTO coinvalues (valuedate, coinvalue) VALUES ?';

      Object.entries(data).forEach(([key, value]) => {
        values.push([key, value]);
      });

      connection.query(sql, [values], callback);
    };
  }
}

module.exports = MySQLService;
