const express = require('express');

const withError = require('../decorators/withError');
const logger = require('../services/logger');

const router = express.Router();

const feedbackRoute = (params) => {
  const { feedbackService } = params;

  router.get('/', withError(async (req, res) => {
    const feedbacks = await feedbackService.getList();

    logger.info(feedbacks);

    res.render('layout', { pageTitle: 'Feedback', template: 'feedback', feedbacks });
  }));

  router.post('/', withError((req, res) => {
    return res.send('Feedback form posted');
  }));

  return router;
};

module.exports = feedbackRoute;
