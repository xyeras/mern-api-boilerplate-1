import { Router } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerValidation, loginValidation } from '../services/validation.js';

// HASH PASSWORD FOR ENCRYPTING PASSWORDS
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

export const authRoute = Router();

authRoute.route('/register').post(async (req, res) => {
  // first validate if the data(req.body) has the required info
  //   Joi validation to help with data validation

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check to see if a user already exists
  // if yes user, then we send back message to front end that user already exists
  // else create a new user
  req.body.email.toLowerCase();
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res
      .status(400)
      .send({ message: 'A user with this email already exists!' });

  try {
    // hashing the password
    req.body.password = await hashPassword(req.body.password);

    // saving the user to our db
    const user = new User(req.body);
    const data = await user.save();

    // return data back to front end to show successful request
    data.password = undefined;
    res.send(data);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

authRoute.route('/login').post(async (req, res) => {
  // check for errors using validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if the user exists by email
  req.body.email.toLowerCase();
  const user = await User.findOne({ email: req.body.email }).select(
    '+password'
  );

  if (!user)
    return res
      .status(400)
      .send({ message: 'That email or password is incorrect!' });

  // check and compare the password the user submits, to the password in the db
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res
      .status(400)
      .send({ message: 'That email or password is incorrect!' });

  // create and assign token for user to save on frontend(react app)
  const token = jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.TOKEN_SECRET
  );

  res
    .header('auth-token', token)
    .send({ message: 'Successfully logged in!', token });

  try {
  } catch (err) {
    res.send({ message: err });
  }
});
