const express = require('express');

const logger = require('../services/logger');

const feedbackRoute = require('./feedback');
const speakersRoute = require('./speakers');

const router = express.Router();

const indexRoute = (params) => {
  router.get('/', async (req, res) => {
    const { speakersService } = params;
    const topSpeakers = await speakersService.getList();
    
    logger.info(topSpeakers);

    res.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers });
  });

  router.use('/feedback', feedbackRoute(params));

  router.use('/speakers', speakersRoute(params));

  return router;
};

module.exports = indexRoute;
