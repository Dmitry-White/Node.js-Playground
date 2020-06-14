const express = require('express');
const { validationResult } = require('express-validator');

const withError = require('../decorators/withError');
const logger = require('../services/logger');
const {
  nameValidator,
  emailValidator,
  titleValidator,
  messageValidator,
} = require('../validators');

const router = express.Router();

const feedbackRoute = (params) => {
  const { feedbackService } = params;

  router.get(
    '/',
    withError(async (req, res) => {
      const feedbacks = await feedbackService.getList();

      const errors = req.session.feedback ? req.session.feedback.errors : false;
      req.session.feedback = {};

      logger.error(errors);

      logger.info(feedbacks);

      res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedbacks,
      });
    }),
  );

  router.post(
    '/',
    [nameValidator, emailValidator, titleValidator, messageValidator],
    withError((req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect('/feedback');
      }

      logger.info(req.body);
      return res.send('Feedback form posted');
    }),
  );

  return router;
};

module.exports = feedbackRoute;
