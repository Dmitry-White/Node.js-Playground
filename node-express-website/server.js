const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const withError = require('./decorators/withError');
const logErrors = require('./middlewares/logErrors');
const xhrErrors = require('./middlewares/xhrErrors');
const errorHandler = require('./middlewares/errorHandler');
const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakersService');
const logger = require('./services/logger');
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

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('short', { stream: logger.stream }));

app.use(express.static(path.join(__dirname, './static')));

app.use(
  withError(async (req, res) => {
    const speakerNames = await speakersService.getNames();

    app.locals.speakerNames = speakerNames;
    logger.info(speakerNames);
  }),
);

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  }),
);

app.use((req, res, next) => {
  if (!req.route) {
    const error = new createError.NotFound('Page not found!');

    return next(error);
  }
  next()
});

app.use(xhrErrors);
app.use(logErrors);
app.use(errorHandler);

app.listen(port, () => logger.info('Example app listening on port port!'));
