const express = require('express');

const feedbackRoute = require('./feedback');
const speakersRoute = require('./speakers');

const router = express.Router();

const indexRoute = (params) => {
  router.get('/', (req, res) => {
    res.render('layout', { pageTitle: 'Welcome', template: 'index' });
  });

  router.use('/feedback', feedbackRoute(params));

  router.use('/speakers', speakersRoute(params));

  return router;
};

module.exports = indexRoute;
