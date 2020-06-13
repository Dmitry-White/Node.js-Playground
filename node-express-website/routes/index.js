const express = require('express');

const withError = require('../decorators/withError');
const logger = require('../services/logger');

const feedbackRoute = require('./feedback');
const speakersRoute = require('./speakers');

const router = express.Router();

const indexRoute = (params) => {
  router.get('/', withError(async (req, res) => {
    const { speakersService } = params;

    const topSpeakers = await speakersService.getList();

    logger.info(topSpeakers);

    const artworks = await speakersService.getAllArtwork();

    logger.info(artworks);

    res.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers, artworks });
  }));

  router.use('/feedback', feedbackRoute(params));

  router.use('/speakers', speakersRoute(params));

  return router;
};

module.exports = indexRoute;
