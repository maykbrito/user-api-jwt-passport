const {
    Strategy,
    ExtractJwt
} = require('passport-jwt')


const User = require('../models/User')

require('dotenv').config()

opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWTSECRET
}

module.exports = passport => {

    passport.use(new Strategy(opts, (payload, done) => {
        User.findById(payload.id).then(user => {
            user ? done(null, user) : done(null, false)
        }).catch(err => console.log(err))
    }))

}