const errorHandler = (err, req, res, next) => {
  // res.status(500).send('Error page!');
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status).render('error', { message: err.message, status });
}

module.exports = errorHandler;