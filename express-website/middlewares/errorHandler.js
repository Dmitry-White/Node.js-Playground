const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).render('error', { message: err.message, status });
};

module.exports = errorHandler;
