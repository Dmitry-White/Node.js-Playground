const handleErrors = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
    return next();
  } catch (error) {
    const err = {
      message: error.message,
    };
    res.status(500).send(err);
    return next(err);
  }
};

export default handleErrors;
