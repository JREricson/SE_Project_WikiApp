// const User = require('../models/user');
// const Photo = require('../models/photo');

var middlewareObj = {};

middlewareObj.isCurUserContentOwner = (req, res, next) => {
  console.log("access attempt");
  console.log("by ", req.user._id);
  console.log("for ", req.params.userId);
  if (req.isAuthenticated()) {
    if (req.user._id.equals(req.params.userId)) {
      console.log("onwer confirmed");
      next();
    } else {
      req.flash("error", "you need to be logged in as the owner to go there");
      res.redirect("/login");
    }
  } else {
    req.flash("error", "you need to be logged in as the owner to go there");
    res.redirect("/login");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "please login first"); //TODO -- get flash to work
    res.redirect("/login");
  }
};

/////////////////////
module.exports = middlewareObj;
