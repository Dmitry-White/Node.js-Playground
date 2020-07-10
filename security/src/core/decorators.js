const handleErrors = (handler) => async (req, res) => {
  try {
    return await handler(req, res);
  } catch (error) {
    const err = {
      message: error.message,
    };
    return res.status(500).send(err);
  }
};

export default handleErrors;
