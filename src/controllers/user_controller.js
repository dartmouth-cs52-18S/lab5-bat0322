import dotenv from 'dotenv';
import jwt from 'jwt-simple';

import User from '../models/user_model';

dotenv.config({ silent: true });

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  if (!userEmail || !userPassword) {
    return res.status(422).send('You must provide email and password');
  }

  User.findOne({ user: userEmail.toLowerCase() }, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    } else if (user) {
      return res.status(422).send('There is already an account associated with this email');
    } else {
      const newUser = new User();
      newUser.email = userEmail;
      newUser.password = userPassword;
      newUser.save();
      return res.send({ token: tokenForUser(newUser) });
    }
  });

  // if (User.find({ user: userEmail.toLowerCase() })) {
  //   return res.status(422).send('There is already an account assoicated with this email');
  // } else {
  //   const user = new User();
  //   user.email = userEmail;
  //   user.password = userPassword;
  //   user.save();
  //   return res.send({ token: tokenForUser(req.user) });
  // }
};
