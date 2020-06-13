const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

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

app.use(morgan('short', { stream: logger.stream }));

app.use(express.static(path.join(__dirname, './static')));

app.use(async (req, res, next) => {
  try {
    const speakerNames = await speakersService.getNames();

    app.locals.speakerNames = speakerNames;
    logger.info(speakerNames);

    return next();
  } catch (error) {
    return next(error);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  }),
);

app.use(xhrErrors);
app.use(logErrors);
app.use(errorHandler);

app.listen(port, () => logger.info('Example app listening on port port!'));
