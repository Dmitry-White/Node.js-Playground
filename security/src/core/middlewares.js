import jwt from 'jsonwebtoken';

import JWT_SECRET from './constants';
import * as validators from './validators';

const setupJWT = (req, res, next) => {
  const isAuthReady =
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT';

  if (!isAuthReady) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      req.headers.authorization.split(' ')[1],
      JWT_SECRET,
    );

    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  return next();
};

const loginRequired = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorised user!' });
  }

  return next();
};

const validate = (validator) => {
  if (!Object.keys(validators).includes(validator)) {
    throw new Error('Validator does not exist!', validator);
  }

  const middleware = async (req, res, next) => {
    try {
      const validated = await validators[validator].validateAsync(req.body);
      req.body = validated;
      return next();
    } catch (err) {
      if (err.isJoi) {
        return res.status(400).json({ message: err.message });
      }

      res.status(500).send(err);
      return next(err);
    }
  };

  return middleware;
};

const logRequests = (req, res, next) => {
  // middleware
  console.log(`Request from: ${req.originalUrl}`);
  console.log(`Request type: ${req.method}`);
  next();
};

const addCSRFToken = (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
};

export { setupJWT, loginRequired, validate, logRequests, addCSRFToken };
