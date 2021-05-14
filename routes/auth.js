const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.get("/", (req, res) => {
  res.send("test");
});

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/register", (req, res) => {
  res.render("pages/register");
});
router.post = (req, res) => {
  const { name, email, password, password2, authKey } = req.body;

  //errors -- will hold a list of all caught errors in registration precess
  let errors = [];

  errors = getValidationErrors(name, email, password, password2, authKey);

  // if (errors.length > 0) {
  //   //rendering page with user info to put in fields and errors for flash images

  //   userMidware.renderPageWithUser(req, res, "auth/register", {
  //     errors,
  //     name,
  //     email,
  //     password,
  //     password2,
  //     authKey,
  //   });
  // } else {
  //   User.findOne({ email: email }).then((user) => {
  //     if (user) {
  //       errors.push({ err: "Email is already registered" });
  //       //rerendering page with saved values
  //       userMidware.renderPageWithUser(req, res, "auth/register", {
  //         errors,
  //         name,
  //         email,
  //         password,
  //         password2,
  //       });
  //     } else {
  //       //passed validation
  //       //creating new user
  //       userMethods.createUser(name, password, email).then((user) => {
  //         req.flash("successReg", "You are now registered. Please sign in");
  //         res.redirect("/login");
  //       });
  //     }
  //   });
  // }
};

/////////////////
//helper functions
/////////////////
const getValidationErrors = (name, email, password, password2, authKey) => {
  errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      err: "all fields are required",
    });
  }

  // if (!password.match())

  //check pw match
  if (password != password2) {
    errors.push({
      err: "all fields are required",
    });
  }

  //check contains num

  //chack pw length
  if (password.length < 9) {
    errors.push({
      err: "password must be at least 9 characters",
    });
  }

  if (!authKey) {
    errors.push({
      err: "authorization key is needed",
    });
  } else if (authKey !== process.env.AUTH_KEY) {
    errors.push({
      err: "authorization key is not valid",
    });
  }
  return errors;
};

module.exports = router;
