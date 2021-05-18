import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

const hashPassword = async password => {
  try {
    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    return e;
  }
};

export const userRoute = express.Router();

userRoute
  .route('/')
  .get(async (req, res) => {
    try {
      const users = await User.find({ deletedAt: null });

      res.json(users);
    } catch (err) {
      res.send({ message: err });
    }
  })
  .post(async (req, res) => {
    let _user = req.body;
    try {
      _user.email = _user.email.toLowerCase();

      _user.password = await hashPassword(_user.password);

      const user = new User(_user);
      const data = await user.save();

      data.password = undefined;
      res.send(data);
    } catch (err) {
      res.send({ message: err });
    }
  });

userRoute
  .route('/:userId')
  .get(async (req, res) => {
    let userId = req.params.userId;
    try {
      const user = await User.findById(userId);
      res.json(user);
    } catch (err) {
      res.send({ message: err });
    }
  })
  .put(async (req, res) => {
    let userId = req.params.userId;
    let user = req.body;
    try {
      const updatedUser = await User.updateOne({ _id: userId }, user);
      res.json(updatedUser);
    } catch (err) {
      res.send({ message: err });
    }
  })
  .delete(async (req, res) => {
    let userId = req.params.userId;
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) res.send({ message: 'no user was found!' });

      await user.updateOne({ deletedAt: new Date() });

      res.json({ message: 'Successfuly deleted one record', userId: user._id });
    } catch (err) {
      res.send({ message: err });
    }
  });
