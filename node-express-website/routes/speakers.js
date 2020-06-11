const express = require('express');

const logger = require('../services/logger');

const router = express.Router();

const speakersRoute = (params) => {
  const { speakersService } = params;

  router.get('/', async (req, res) => {
    const speakers = await speakersService.getList();

    logger.info(speakers);

    res.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers });
  });

  router.get('/:shortname', async (req, res) => {
    const { shortname } = req.params;
    const speaker = await speakersService.getSpeaker(shortname);

    logger.info(speaker);

    const artworks = await speakersService.getArtworkForSpeaker(shortname);

    logger.info(artworks);

    res.render('layout', { pageTitle: speaker.name, template: 'speaker-details', speaker, artworks });
  });

  return router;
};

module.exports = speakersRoute;
