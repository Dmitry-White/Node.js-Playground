const express = require('express');

const router = express.Router();

const speakersRoute = (params) => {
  const { speakersService } = params;

  router.get('/', async (req, res) => {
    const speakers = await speakersService.getList();
    return res.json(speakers);
  });

  router.get('/:shortname', (req, res) => {
    return res.send(`Detail page of ${req.params.shortname}`);
  });

  return router;
};

module.exports = speakersRoute;
