// const User = require('../models/user');
// const Photo = require('../models/photo');

var middlewareObj = {};

middlewareObj.isCurUserContentOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user._id.equals(req.params.userId)) {
      console.log("owner confirmed");
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
    req.flash("error", "Cannot access without being logged in"); //TODO -- get flash to work
    res.redirect("/login");
  }
};

/////////////////////
module.exports = middlewareObj;
