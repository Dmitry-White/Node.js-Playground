const { check } = require('express-validator');

const nameValidator = check('name')
  .trim()
  .isLength({ min: 3 })
  .escape()
  .withMessage('A name is required');

const emailValidator = check('email')
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage('A valid email is required');

const titleValidator = check('title')
  .trim()
  .isLength({ min: 3 })
  .escape()
  .withMessage('A title is required');

const messageValidator = check('message')
  .trim()
  .isLength({ min: 5 })
  .escape()
  .withMessage('A message is required');

module.exports = {
  nameValidator,
  emailValidator,
  titleValidator,
  messageValidator,
};
