const express = require('express');

const router = express.Router();

const feedbackRoute = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res) => {
    const feedbacks = await feedbackService.getList();
    return res.json(feedbacks);
  });

  router.post('/', (req, res) => {
    return res.send('Feedback form posted');
  });

  return router;
};

module.exports = feedbackRoute;
