const withErrors = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
    return next();
  } catch (error) {
    const err = {
      message: error.message,
    };
    res.status(500).send(err);
    return next(err);
  }
};

export default withErrors;
