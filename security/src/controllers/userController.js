import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserSchema from '../models/userModel';

import JWT_SECRET from '../core/constants';

const User = mongoose.model('User', UserSchema);

const register = async (req, res) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  const userData = {
    username: req.body.username,
    email: req.body.email,
    hashPassword,
  };
  const newUser = new User(userData);
  const user = await newUser.save();

  user.hashPassword = null;

  return res.json(user);
};

const login = async (req, res) => {
  const userData = {
    email: req.body.email,
  };

  try {
    const user = await User.findOne(userData);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Authentication failed - no user found!' });
    }

    if (!user.comparePassword(req.body.password, user.hashPassword)) {
      return res
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
    throw new Error('Authentication failed - something went wrong!', error);
  }
};

export { register, login };
