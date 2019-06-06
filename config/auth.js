const passport = require('passport');
const doPassport = require('./passport');

module.exports = app => {
  app.use(passport.initialize());
  doPassport(passport);
};
