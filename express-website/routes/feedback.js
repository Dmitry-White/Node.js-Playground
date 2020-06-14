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
      const message = req.session.feedback
        ? req.session.feedback.message
        : false;
      req.session.feedback = {};

      logger.error(errors);

      logger.info(feedbacks);

      res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedbacks,
        errors,
        message,
      });
    }),
  );

  router.post(
    '/',
    [nameValidator, emailValidator, titleValidator, messageValidator],
    withError(async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect('/feedback');
      }

      logger.info(req.body);

      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);

      req.session.feedback = {
        message: 'Thank you for your feedback!',
      };

      return res.redirect('/feedback');
    }),
  );

  return router;
};

module.exports = feedbackRoute;
