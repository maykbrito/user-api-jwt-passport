const { Strategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/User');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTSECRET,
};

module.exports = passport => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        user ? done(null, user) : done(null, false);
      } catch (err) {
        console.log(err);
      }
    })
  );
};
