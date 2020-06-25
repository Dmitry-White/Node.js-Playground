const basicAuth = require('basic-auth');

module.exports = (username, password) => {
  return function(req, res, next) {
    const user = basicAuth(req);

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    }

    next();
  };
};
