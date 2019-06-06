const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const userFound = await User.findOne({
    email,
  });

  if (userFound)
    return res.status(400).json({
      email: 'Email exists',
    });

  const newUser = new User({
    name,
    email,
    password,
  });

  newUser.password = await generateHash(password);

  newUser
    .save()
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({
    email,
  });

  if (!userFound)
    return res.status(400).json({
      email: 'User not found',
    });

  const isMatch = await bcrypt.compare(password, userFound.password);
  if (!isMatch)
    return res.status(400).json({
      password: 'Password is not corret',
    });

  res.json(await jwtSign(userFound));
});

router.get(
  '/current',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    const { id, name, email, date } = req.user;
    res.json({
      id,
      name,
      email,
      date,
    });
  }
);

const generateHash = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => resolve(hash));
    });
  });

const jwtSign = user => {
  const payload = {
    id: user.id,
    name: user.name,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWTSECRET,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        resolve({
          success: true,
          token: `Bearer ${token}`,
        });
      }
    );
  });
};

module.exports = router;
