const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  transports: [
    new transports.Console({
      handleExceptions: true,
      colorize: true
    })
  ]
});

logger.stream = {
  write: (message) => logger.info(message)
};

module.exports = logger;