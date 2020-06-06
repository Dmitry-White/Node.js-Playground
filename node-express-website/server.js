const express = require('express');
const morgan = require('morgan');
const path = require('path');

const logger = require('./services/logger');

const app = express();
const port = 3000;

app.use(morgan('short', { stream: logger.stream }));

app.use(express.static(path.join(__dirname, './static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './static/index.html'));
});

app.get('/speakers', (req, res) => {
  res.sendFile(path.join(__dirname, './static/speakers.html'));
});

app.listen(port, () => logger.info('Example app listening on port port!'));
