const logger = require('../services/logger');

const logErrors = (err, req, res, next) => {
  logger.error({
    status: err.status || 500,
    message: err.message,
    stack: err.stack
  });
  next(err);
}

module.exports = logErrors;