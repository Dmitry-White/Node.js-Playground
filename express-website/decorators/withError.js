const withError = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = withError;
