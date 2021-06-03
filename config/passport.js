const LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "userName" },
      (userName, password, done) => {
        // Match user
        User.findOne({
          usr_name: userName,
        }).then((user) => {
          if (!user) return sendErrIfUserNotValid(done);
          comparePWandHandleReq(password, user, done);
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
const comparePWandHandleReq = (password, user, done) => {
  bcrypt.compare(password, user.usr_password, (err, isMatch) => {
    if (err) throw err; //TODO handle err
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  });
};

const sendErrIfUserNotValid = (done) => {
  {
    return done(null, false, {
      message: "nobody with that user name",
    });
  }
};
