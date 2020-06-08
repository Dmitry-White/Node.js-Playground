const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const logger = require('./services/logger');
const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakersService');
const routes = require('./routes');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const app = express();
const port = 3000;

app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(
  cookieSession({
    name: 'session',
    keys: ['DkgsdgIGsDgiksdbgsdkS', 'ADGDSgiusdgjHSBd'],
  }),
);

app.use(morgan('short', { stream: logger.stream }));

app.use(express.static(path.join(__dirname, './static')));

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  }),
);

app.listen(port, () => logger.info('Example app listening on port port!'));
