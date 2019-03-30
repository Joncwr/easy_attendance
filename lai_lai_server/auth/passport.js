const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { saltHashPassword, randomString } = require('../helpers/store')
const Users = require('../models/users')
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
  },
  (jwt_payload, done) => {
    let { id } = jwt_payload.user
    return Users
      .query()
      .findById(id)
      .then((user) => {
        // Add logic if theres an error. But must check what err Objection throws back if its a DB error
        // --insert db error handling
        if (user) return done(null, user)
        else {
          return done(null, false)
          // can add things like create user / etc ..
        }
      })
}));


passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username,password,callback) => {
    return Users
      .query()
      .where({ username })
      .then(([user]) => {
        if (!user) {
          return callback(null, false, {message: 'Incorrect Username.'})
        }
        else {
          const { hash } = saltHashPassword({
            password,
            salt: user.salt
          })
          if ( hash === user.password) {
            return callback(null, user, {message: 'Logged In Successfully'});
          }
          else {
            return callback(null, false, {message: 'Incorrect Username.'})
          }
        }
      })
      .catch(err => callback(err))
}))
