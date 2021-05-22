/*jshint esversion: 6 */

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "userName" },
      (userName, password, done) => {
        // Match user
        User.findOne({
          usr_name: userName,
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: "nodody with that user name",
            });
          }

          // Match password
          bcrypt.compare(password, user.usr_password, (err, isMatch) => {
            if (err) throw err; //TODO handle err
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id); //._id??
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
