const bunyan = require('bunyan');

const appname = 'Shopsy';

module.exports = {
  applicationName: appname,
  logger: bunyan.createLogger({ name: appname }),
  mongodb: {
    dsn: 'mongodb://localhost:37017/shopsy'
  },
  redis: {
    client: {},
    options: {
      port: 7379
    }
  }
};
