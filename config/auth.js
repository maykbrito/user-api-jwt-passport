module.exports = app => {
    const passport = require('passport')
    app.use(passport.initialize())
    require("./passport")(passport)
}