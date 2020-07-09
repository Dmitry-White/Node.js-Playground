import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserSchema from '../models/userModel';

const JWT_SECRET = 'SECRET';    

const User = mongoose.model('User', UserSchema);

const loginRequired = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorised user!' });
  }

  next();
};

const register = (req, res) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);

  const userData = {
    username: req.body.username,
    email: req.body.email,
    hashPassword,
  };
  const newUser = new User(userData);

  try {
    const user = await newUser.save();

    delete user.hashPassword;

    return res.json(user);
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const login = (req, res) => {
  const userData = {
    email: req.body.email,
  };

  try {
    const user = await User.findOne(userData);

    if (!user) {
      res
        .status(401)
        .json({ message: 'Authentication failed - no user found!' });
    }

    if (!user.comparePassword(req.body.password, user.hashPassword)) {
      res
        .status(401)
        .json({ message: 'Authentication failed - wrong password!' });
    }

    const tokenData = {
      _id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenData, JWT_SECRET);

    return res.json({ token });
  } catch (error) {
    throw error;
  }
};
