const express = require('express');

const router = express.Router();

const feedbackRoute = () => {
  router.get('/', (req, res) => {
    return res.send('Feedback page');
  });

  router.post('/', (req, res) => {
    return res.send('Feedback form posted');
  });

  return router;
};

module.exports = feedbackRoute;
