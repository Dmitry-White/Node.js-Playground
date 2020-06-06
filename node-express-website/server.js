const express = require('express');
const morgan = require('morgan');
const path = require('path');

const logger = require('./services/logger');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(morgan('short', { stream: logger.stream }));

app.use(express.static(path.join(__dirname, './static')));

app.get('/', (req, res) => {
  res.render('pages/index', { pageTitle: 'Welcome' });
});

app.get('/speakers', (req, res) => {
  res.sendFile(path.join(__dirname, './static/speakers.html'));
});

app.listen(port, () => logger.info('Example app listening on port port!'));
