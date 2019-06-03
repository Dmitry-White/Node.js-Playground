const express = require('express');
const morgan = require('morgan');

const logger = require('./services/logger');

const app = express();
const port = 3000;

app.use(morgan('short', { stream: logger.stream }));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => logger.info(`Example app listening on port port!`));