const logger = require('../services/logger');

const logErrors = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack
  });
  next(err);
}

module.exports = logErrors;