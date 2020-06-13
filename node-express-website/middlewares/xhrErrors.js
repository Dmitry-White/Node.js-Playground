const xhrErrors = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Some XHR thing failed!' })
  } else {
    next(err)
  }
}

module.exports = xhrErrors;