const loginRequired = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorised user!' });
  }

  return next();
};

export default loginRequired;
