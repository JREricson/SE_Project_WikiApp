//imported modules
const express = require("express"),
  router = express.Router(),
  passport = require("passport");

//app modules
const DbMethods = require("../helpers/databaseMethods"),
  authMiddle = require("../middle/authMiddle");

// Passport Config
require("../config/passport")(passport);
//Mongo Model
const User = require("../models/user");

router.get("/login", (req, res) => {
  res.render("pages/login");
});

//handle login
router.post("/login", async (req, res, next) => {
  await passport.authenticate("local", {
    successRedirect: `/lists/new`, //${req.user._id}/profile`, //TODO -- change route
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/", (req, res) => {
  res.render("pages/home");
});

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("successMsg", "You are now logged out");
  res.redirect("/login");
});

router.get("/register", (req, res) => {
  res.render("pages/register");
});
router.post("/register", (req, res) => {
  const { userName, password, password2, authKey } = req.body;

  let errors = getValidationErrors(userName, password, password2, authKey);

  let renderObj = { userName, password, password2, authKey };
  if (errors.length > 0) {
    res.render("pages/register", renderObj);
  } else {
    User.findOne({ usr_name: userName }).then((user) => {
      if (user) {
        errors.push({ err: "User name is already taken" });
        //rerendering page with saved values
        res.render("pages/register", {
          errors,
          userName,
          password,
          password2,
        });
      } else {
        //passed validation
        //creating new user
        DBmethods.createUser(userName, password).then((user) => {
          req.flash("successMsg", "You are now registered. Please sign in");
          res.redirect("/login");
        });
      }
    });
  }
});

//Handle delete user request
router.get("/deleteuser", authMiddle.isLoggedIn, async (req, res) => {
  let listOfUserIds = req.user.usr_listIds;

  await DbMethods.deleteAllListInArray(listOfUserIds);
  await DbMethods.deleteUser(req.user._id);
  req.flash("successMsg", "You're account has been deleted");

  res.redirect("/login");
});

/////////////////
//helper functions
/////////////////
const getValidationErrors = (userName, password, password2, authKey) => {
  errors = [];

  //check required fields
  if (!userName || !password || !password2 || !authKey) {
    errors.push({ err: "all fields are required" });
  }

  //check pw match
  if (password != password2) {
    errors.push({
      err: "passwords must match",
    });
  }

  //check contains num

  //check pw length
  if (password.length <= 9) {
    errors.push({ err: "password must be at least 9 characters" });
  }

  if (!authKey) {
    errors.push({
      err: "authorization key is needed",
    });
  } else if (authKey !== process.env.AUTH_KEY) {
    errors.push({ err: "authorization key is not valid" });
  }
  return errors;
};

module.exports = router;
