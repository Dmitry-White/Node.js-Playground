const express = require('express');

const router = express.Router();

const speakersRoute = () => {
  router.get('/', (req, res) => {
    return res.send('Speakers page');
  });

  router.get('/:shortname', (req, res) => {
    return res.send(`Detail page of ${req.params.shortname}`);
  });

  return router;
};

module.exports = speakersRoute;
